import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';

export const parseResume = async (buffer, originalName) => {
  const ext = originalName.toLowerCase();
  if (ext.endsWith('.pdf')) {
    const data = await pdfParse(buffer);
    return data.text;
  }

  if (ext.endsWith('.docx')) {
    const { value } = await mammoth.extractRawText({ buffer });
    return value;
  }

  throw new Error('Unsupported resume format');
};
