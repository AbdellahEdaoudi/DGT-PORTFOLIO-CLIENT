import { pdf } from '@react-pdf/renderer';
import ResumePdf from './ResumePdf';

self.onmessage = async (event) => {
    try {
        const { userData } = event.data;
        // Generate the PDF blob inside the worker
        const blob = await pdf(<ResumePdf userData={userData} />).toBlob();
        self.postMessage({ success: true, blob });
    } catch (error) {
        console.error("PDF Worker Error:", error);
        self.postMessage({ success: false, error: error.message });
    }
};
