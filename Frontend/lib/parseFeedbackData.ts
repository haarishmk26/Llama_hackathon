export function parseFeedbackData(csvText: string) {
  const lines = csvText.trim().split('\n');
  const headers = lines[0].split(',');
  
  return lines.slice(1).map(line => {
    const values = line.split(',');
    const row: any = {};
    
    headers.forEach((header, index) => {
      const value = values[index];
      // Convert numeric values
      row[header.trim()] = isNaN(Number(value)) ? value : Number(value);
    });
    
    return row;
  });
} 