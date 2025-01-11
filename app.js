async function getSynonyms() {
    const inputText = document.getElementById('inputText').value;
    const wordType = document.getElementById('wordType').value;
    const outputDiv = document.getElementById('output');

    // تقسيم النص إلى كلمات فردية
    const words = inputText.match(/\b(\w+)\b/g);

    if (!words) {
        outputDiv.innerHTML = '<p>لم يتم العثور على كلمات في النص المدخل.</p>';
        return;
    }

    let synonymsList = '';

    for (let word of words) {
        const synonyms = await fetchSynonyms(word, wordType);
        if (synonyms.length > 0) {
            synonymsList += `<strong>${word}:</strong> ${synonyms.join(', ')}<br>`;
        } else {
            synonymsList += `<strong>${word}:</strong> لا توجد مرادفات متاحة<br>`;
        }
    }

    outputDiv.innerHTML = synonymsList;
}

async function fetchSynonyms(word, wordType) {
    // استخدم API خارجية للحصول على المرادفات
    const apiKey = 'YOUR_API_KEY'; // استبدل بـ API key الخاص بك
    const apiUrl = `https://wordsapiv1.p.rapidapi.com/words/${word}/synonyms`;

    try {
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'x-rapidapi-key': apiKey,
                'x-rapidapi-host': 'wordsapiv1.p.rapidapi.com'
            }
        });
        const data = await response.json();

        if (data.synonyms && data.synonyms.length > 0) {
            if (wordType === 'uncommon') {
                // يمكنك تصفية الكلمات الغير شائعة بناءً على البيانات التي تحصل عليها
                return data.synonyms.filter(synonym => isUncommon(synonym));
            } else {
                return data.synonyms;
            }
        } else {
            return [];
        }
    } catch (error) {
        console.error('حدث خطأ:', error);
        return [];
    }
}

function isUncommon(word) {
    // منطق بسيط لتقرير ما إذا كانت الكلمة غير شائعة
    // يمكنك توسيع هذا المنطق بناءً على بياناتك الخاصة
    const uncommonWords = ['aberration', 'ephemeral', 'serendipity']; // مثال فقط
    return uncommonWords.includes(word);
}
