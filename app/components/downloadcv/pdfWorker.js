import { pdf } from '@react-pdf/renderer';
import ResumePdf from './ResumePdf';
import { getDownloadCvTranslation } from '../../translations/download-cv';

self.onmessage = async (event) => {
    try {
        const { userData } = event.data;
        const dictionary = await getDownloadCvTranslation(userData?.displayLanguage || 'en');
        // Generate the PDF blob inside the worker
        const blob = await pdf(<ResumePdf userData={userData} dictionary={dictionary} />).toBlob();
        self.postMessage({ success: true, blob });
    } catch (error) {
        console.error("PDF Worker Error:", error);
        self.postMessage({ success: false, error: error.message });
    }
};
