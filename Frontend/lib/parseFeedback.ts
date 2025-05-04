/**
 * Parses feedback from various file formats
 * @param file The feedback file to parse
 * @returns Parsed feedback data
 */
export async function parseFeedback(file: File) {
  const extension = file.name.split(".").pop()?.toLowerCase()

  if (extension === "csv") {
    return parseCSV(file)
  } else if (extension === "json") {
    return parseJSON(file)
  } else {
    return parseText(file)
  }
}

async function parseCSV(file: File) {
  const text = await file.text()
  // Basic CSV parsing - in a real app, use a proper CSV parser
  const lines = text.split("\n")
  const headers = lines[0].split(",")

  const results = []

  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue

    const values = lines[i].split(",")
    const entry: Record<string, string> = {}

    headers.forEach((header, index) => {
      entry[header.trim()] = values[index]?.trim() || ""
    })

    results.push(entry)
  }

  return results
}

async function parseJSON(file: File) {
  const text = await file.text()
  return JSON.parse(text)
}

async function parseText(file: File) {
  const text = await file.text()
  // Simple text parsing - split by lines and assume each line is a feedback entry
  return text
    .split("\n")
    .filter((line) => line.trim())
    .map((line) => ({ text: line.trim() }))
}
