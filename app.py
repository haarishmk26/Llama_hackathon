from flask import Flask, request, jsonify
from dotenv import load_dotenv
import os
import json  # Make sure json is imported
import base64
import requests
from flask_cors import CORS

load_dotenv()
app = Flask(__name__)
CORS(app, origins=["http://localhost:3000", "http://127.0.0.1:3000"])

# Configure maximum file size (16MB)
app.config["MAX_CONTENT_LENGTH"] = 16 * 1024 * 1024  # 16MB in bytes


@app.route("/", methods=["GET"])
def home():
    return "Llama Backend is running!", 200


@app.route("/api/analyze-changes", methods=["POST"])
def analyze_changes():
    # --- Start: Input Handling and Validation ---

    # 1. Check for image files
    if "beforeImage" not in request.files or "afterImage" not in request.files:
        app.logger.error("Missing image files in request.")
        return jsonify(
            {"error": "Missing required image files ('beforeImage', 'afterImage')"}
        ), 400

    before_image_file = request.files["beforeImage"]
    after_image_file = request.files["afterImage"]

    # Optional: Add checks for file size or type if needed
    # e.g., allowed_extensions = {'png', 'jpg', 'jpeg'}
    # if not ('.' in before_image_file.filename and \
    #         before_image_file.filename.rsplit('.', 1)[1].lower() in allowed_extensions):
    #     return jsonify({"error": "Invalid file type for beforeImage"}), 400

    # 2. Check for feedback data in form
    feedback_data_json = request.form.get("feedback")
    feedback_data = None  # Initialize
    if not feedback_data_json:
        # Check if JSON was sent directly in the body (alternative)
        if request.is_json:
            feedback_data = request.get_json()
            if not feedback_data:
                app.logger.error("Missing feedback data (checked form and JSON body).")
                return jsonify({"error": "Missing feedback data"}), 400
        else:
            app.logger.error("Missing feedback data in form and request is not JSON.")
            return jsonify(
                {"error": "Missing feedback data (expected in form field 'feedback')"}
            ), 400
    else:
        # 3. Try parsing feedback JSON from form field
        try:
            feedback_data = json.loads(feedback_data_json)
            if not feedback_data:  # Handle empty JSON object/array case
                app.logger.warning("Feedback data parsed as empty.")
        except json.JSONDecodeError:
            app.logger.error(
                f"Invalid JSON format in feedback field: {feedback_data_json[:100]}..."
            )  # Log snippet
            return jsonify({"error": "Invalid JSON format in feedback field"}), 400

    # At this point, we should have:
    # - before_image_file
    # - after_image_file
    # - feedback_data (parsed from JSON)

    app.logger.info("Inputs validated successfully. Preparing data for Llama API.")

    # --- End: Input Handling and Validation ---

    # === Start: Step 5 - Prepare Data and Call Llama API ===

    # 1. Read and encode images
    try:
        before_image_bytes = before_image_file.read()
        after_image_bytes = after_image_file.read()
        before_image_base64 = base64.b64encode(before_image_bytes).decode("utf-8")
        after_image_base64 = base64.b64encode(after_image_bytes).decode("utf-8")
        app.logger.info(
            f"Encoded before image ({len(before_image_bytes)} bytes) and after image ({len(after_image_bytes)} bytes)."
        )
    except Exception as e:
        app.logger.error(f"Error reading or encoding image file: {e}")
        return jsonify({"error": "Could not read image files"}), 500

    # 2. Format feedback data into text
    feedback_text = ""
    if isinstance(feedback_data, list):
        for item in feedback_data:
            user = item.get("User Name", "Unknown User")
            role = item.get("User Role", "")
            pain = item.get("Pain Points", "N/A")
            suggestion = item.get("Suggested Improvements", "N/A")
            feedback_text += f"- User: {user} ({role})\n  Pain Point: {pain}\n  Suggestion: {suggestion}\n\n"
    elif isinstance(feedback_data, dict):
        feedback_text = json.dumps(feedback_data, indent=2)
    elif isinstance(feedback_data, str):
        feedback_text = feedback_data
    else:
        feedback_text = "No feedback provided or format not recognized."

    # 3. Construct the detailed prompt
    prompt = (
        "You are a product manager or a product person who has deep insights into the product and analyzes data really well. "
        "Analyze the visual difference between the 'before' and 'after' UI screenshots provided, considering the user feedback for the 'before' version. "
        "Give a concise summary of the changes and insights based ONLY on the provided visuals and feedback text.\n\n"
        "User Feedback for 'before' version:\n"
        f"<UserFeedback>\n{feedback_text}\n</UserFeedback>\n\n"
        "Return your analysis ONLY in the following valid JSON structure, with no extra text before or after:\n"
        "{"
        '  "summary_section": {'
        "    \"key_changes_narrative\": \"A paragraph summarizing the key changes from 'before' to 'after', highlighting how user feedback was addressed.\","
        '    "addressed_issues": ["Bullet point string describing a specific user pain point from the feedback that appears resolved/improved in the \'after\' UI."],'
        '    "outstanding_issues": ["Bullet point string describing potential issues still present in the \'after\' UI or feedback points not addressed."]'
        "  },"
        '  "feedback_analysis_section": {'
        '    "sentiment_summary": "A brief text summarizing the overall sentiment (positive, negative, neutral) and key themes found ONLY in the provided user feedback.",'
        '    "sentiment_scores": {'
        '      "positive_percent": /* integer percentage, e.g., 20 */,'
        '      "neutral_percent":  /* integer percentage, e.g., 20 */,'
        '      "negative_percent": /* integer percentage, e.g., 60 */'
        "    }"
        "}"
    )
    app.logger.info("Constructed prompt for Llama API.")

    # 4. Get API config from environment
    llama_endpoint = os.getenv("LLAMA_API_ENDPOINT")
    llama_api_key = os.getenv("LLAMA_API_KEY")
    if not llama_endpoint or not llama_api_key:
        app.logger.error(
            "LLAMA_API_ENDPOINT or LLAMA_API_KEY not configured in .env file."
        )
        return jsonify(
            {"error": "Server configuration error: Missing API credentials."}
        ), 500

    # 5. Prepare Llama API payload (OpenAI Chat Completions Format)
    llama_payload = {
        "model": "Llama-4-Maverick-17B-128E-Instruct-FP8",  # Or your desired model
        "messages": [
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": prompt},
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": f"data:{before_image_file.mimetype};base64,{before_image_base64}",
                            "detail": "low",
                        },
                    },
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": f"data:{after_image_file.mimetype};base64,{after_image_base64}",
                            "detail": "low",
                        },
                    },
                ],
            }
        ],
        "max_tokens": 1500,
    }

    headers = {
        "Authorization": f"Bearer {llama_api_key}",
        "Content-Type": "application/json",
    }

    # 6. Call Llama API
    try:
        app.logger.info(f"Sending request to Llama API endpoint: {llama_endpoint}")
        response = requests.post(
            llama_endpoint, headers=headers, json=llama_payload, timeout=60
        )
        response.raise_for_status()
        app.logger.info(
            f"Received successful response from Llama API (Status: {response.status_code})."
        )

        print("=== RAW LLAMA RESPONSE TEXT ===")
        print(response.text)
        print("================================")

        # === Start: Step 6 - Handle Llama API Response ===

        analysis_result_structured = None
        try:
            # 1. Parse the OpenAI-style response
            llama_response = response.json()
            app.logger.info("Successfully parsed Llama response as JSON.")
            # Extract the content string from the first choice
            content_str = llama_response["choices"][0]["message"]["content"]
            print("=== RAW LLAMA CONTENT STRING ===")
            print(content_str)
            print("=================================")
            # Remove triple backticks and optional 'json' label
            content_str = content_str.strip()
            if content_str.startswith("```json"):
                content_str = content_str[len("```json") :].strip()
            if content_str.startswith("```"):
                content_str = content_str[len("```") :].strip()
            if content_str.endswith("```"):
                content_str = content_str[:-3].strip()
            # Now parse the cleaned string as JSON
            analysis_result_structured = json.loads(content_str)
            print("=== PARSED ANALYSIS STRUCTURED ===")
            print(analysis_result_structured)
            print("==================================")
        except Exception as e:
            app.logger.error(f"Failed to extract/parse JSON from Llama response: {e}")
            return jsonify(
                {"error": "Analysis service returned invalid data format."}
            ), 502

        # Validate the structure of the parsed/extracted JSON
        if (
            not isinstance(analysis_result_structured, dict)
            or "summary_section" not in analysis_result_structured
            or "feedback_analysis_section" not in analysis_result_structured
            or not isinstance(analysis_result_structured.get("summary_section"), dict)
            or not isinstance(
                analysis_result_structured.get("feedback_analysis_section"), dict
            )
            or not all(
                k in analysis_result_structured["summary_section"]
                for k in [
                    "key_changes_narrative",
                    "addressed_issues",
                    "outstanding_issues",
                ]
            )
            or not all(
                k in analysis_result_structured["feedback_analysis_section"]
                for k in ["sentiment_summary", "sentiment_scores"]
            )
            or not isinstance(
                analysis_result_structured["feedback_analysis_section"].get(
                    "sentiment_scores"
                ),
                dict,
            )
            or not all(
                k
                in analysis_result_structured["feedback_analysis_section"][
                    "sentiment_scores"
                ]
                for k in ["positive_percent", "neutral_percent", "negative_percent"]
            )
        ):
            app.logger.error(
                f"Llama response JSON missing expected structure."  # Simplified log here
            )
            return jsonify(
                {"error": "Analysis service returned incomplete data structure."}
            ), 502

        app.logger.info("Llama response structure validated successfully.")

        # Combine Llama analysis with the original feedback for the frontend
        final_response = {
            "analysis": analysis_result_structured,
            "original_feedback": feedback_data,  # Send the raw feedback back too
        }

        # === End: Step 6 - Handle Llama API Response ===

        return jsonify(final_response), 200  # Success!

    except requests.exceptions.Timeout:
        app.logger.error("Llama API request timed out.")
        return jsonify({"error": "Analysis service timed out."}), 504  # Gateway Timeout
    except requests.exceptions.RequestException as e:
        error_message = f"Error communicating with analysis service: {e}"
        status_code = 502
        if e.response is not None:
            error_message = f"Llama API Error: {e.response.status_code} - {e.response.text[:500]}..."
            status_code = (
                e.response.status_code if e.response.status_code >= 400 else 500
            )
        app.logger.error(error_message)
        return jsonify(
            {"error": "Failed to get analysis from external service."}
        ), status_code
    # === End: Step 5 - Call Llama API ===


# Runner (add if not present)
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5001))
    # Basic logging configuration for development
    if os.getenv("FLASK_ENV") == "development":
        import logging

        # Ensure logging is configured to show INFO level messages
        logging.basicConfig(level=logging.INFO)
        app.logger.setLevel(logging.INFO)  # Use logging.INFO here
    app.run(debug=(os.getenv("FLASK_ENV") == "development"), host="0.0.0.0", port=port)
