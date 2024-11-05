// Получаем форму по ее ID
const cvForm = document.getElementById('cvForm');

// Добавляем обработчик события для отправки формы
cvForm.addEventListener('submit', function(event) {
    event.preventDefault(); // Предотвращаем перезагрузку страницы

    // Проверяем валидность формы
    if (!cvForm.checkValidity()) {
        alert('Пожалуйста, заполните все обязательные поля.');
        return;
    }

    // Получаем значения из полей ввода
    const fullName = document.getElementById('fullName').value;
    const dob = document.getElementById('dob').value;
    const contactInfo = document.getElementById('contactInfo').value;
    const education = document.getElementById('education').value;
    const skills = document.getElementById('skills').value;
    const petProjects = document.getElementById('petProjects').value;
    const aboutMe = document.getElementById('aboutMe').value;

    // Вызываем функцию для создания и скачивания .docx файла
    generateDocx(fullName, dob, contactInfo, education, skills, petProjects, aboutMe);
});

// Функция для генерации и скачивания .docx файла
function generateDocx(fullName, dob, contactInfo, education, skills, petProjects, aboutMe) {
    // Создаем новый документ
    const doc = new docx.Document();

    // Массив для хранения элементов документа
    const docContent = [];

    // Добавляем ФИО как заголовок
    docContent.push(
        new docx.Paragraph({
            text: fullName,
            heading: docx.HeadingLevel.HEADING_1,
            alignment: docx.AlignmentType.CENTER,
        }),
        new docx.Paragraph({ text: '' }) // Пустая строка для отступа
    );

    // Функция для добавления разделов
    function addSection(title, content) {
        docContent.push(
            new docx.Paragraph({
                text: title,
                heading: docx.HeadingLevel.HEADING_2,
            }),
            new docx.Paragraph({ text: content })
        );
    }

    // Добавляем обязательные разделы
    addSection('Дата рождения', dob);
    addSection('Контактная информация', contactInfo);
    addSection('Образование', education);
    addSection('Навыки', skills);

    // Добавляем раздел "Пет проекты", если заполнен
    if (petProjects) {
        addSection('Пет проекты', petProjects);
    }

    // Добавляем раздел "Обо мне", если заполнен
    if (aboutMe) {
        addSection('Обо мне', aboutMe);
    }

    // Добавляем содержимое в документ
    doc.addSection({
        properties: {},
        children: docContent,
    });

    // Генерируем документ и инициируем скачивание
    docx.Packer.toBlob(doc).then(blob => {
        // Создаем ссылку для скачивания
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'resume.docx'; // Имя скачиваемого файла

        // Добавляем ссылку на страницу и кликаем по ней
        document.body.appendChild(link);
        link.click();

        // Удаляем ссылку и освобождаем память
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);

        // Сообщаем пользователю об успешном сохранении
        alert('Резюме успешно сохранено в формате .docx!');
    });
}
