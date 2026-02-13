import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Türkçe karakter dönüşüm fonksiyonu
const turkishToAscii = (text: string): string => {
    return text
        .replace(/ş/g, 's').replace(/Ş/g, 'S')
        .replace(/ğ/g, 'g').replace(/Ğ/g, 'G')
        .replace(/ü/g, 'u').replace(/Ü/g, 'U')
        .replace(/ö/g, 'o').replace(/Ö/g, 'O')
        .replace(/ç/g, 'c').replace(/Ç/g, 'C')
        .replace(/ı/g, 'i').replace(/İ/g, 'I');
};

export const handleDownloadPDF = (menuData: any[]) => {
    const doc = new jsPDF();

    // Use Courier font for better Turkish character support
    doc.setFont('courier');

    // Header
    doc.setFontSize(20);
    doc.setTextColor(220, 38, 38);
    doc.text(turkishToAscii('THKU Yemekhane Menüsü'), 105, 20, { align: 'center' });

    doc.setFontSize(14);
    doc.setTextColor(100, 100, 100);
    doc.text(turkishToAscii('Şubat 2026'), 105, 30, { align: 'center' });

    // Table data
    const tableData = menuData.map((item: any) => {
        const dateStr = new Date(item.date).toLocaleDateString('tr-TR', { day: '2-digit', month: 'long' });

        return [
            turkishToAscii(dateStr),
            turkishToAscii(item.day),
            turkishToAscii(item.soup),
            turkishToAscii(item.main),
            turkishToAscii(item.side),
            `${item.calorie} kcal`,
            `Pro:${item.protein}g Karb:${item.carbs}g Yag:${item.fat}g`
        ];
    });

    autoTable(doc, {
        head: [[
            turkishToAscii('Tarih'),
            turkishToAscii('Gün'),
            turkishToAscii('Çorba'),
            'Ana Yemek',
            'Yan',
            'Kalori',
            'Besin'
        ]],
        body: tableData,
        startY: 40,
        theme: 'grid',
        headStyles: {
            fillColor: [220, 38, 38],
            textColor: [255, 255, 255],
            fontStyle: 'bold',
            font: 'courier'
        },
        bodyStyles: {
            font: 'courier'
        },
        styles: {
            fontSize: 7,
            cellPadding: 2.5,
            font: 'courier'
        },
        columnStyles: {
            0: { cellWidth: 22 },
            1: { cellWidth: 18 },
            2: { cellWidth: 28 },
            3: { cellWidth: 32 },
            4: { cellWidth: 24 },
            5: { cellWidth: 18 },
            6: { cellWidth: 42 }
        }
    });

    // Footer
    const pageCount = (doc as any).internal.getNumberOfPages();
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.text(`Sayfa ${i} / ${pageCount}`, 105, 285, { align: 'center' });
    }

    doc.save('THKU-Yemekhane-Menusu-Subat-2026.pdf');
};
