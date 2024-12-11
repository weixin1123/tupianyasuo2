document.addEventListener('DOMContentLoaded', function() {
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileInput');
    const previewArea = document.getElementById('previewArea');
    const originalPreview = document.getElementById('originalPreview');
    const compressedPreview = document.getElementById('compressedPreview');
    const originalSize = document.getElementById('originalSize');
    const compressedSize = document.getElementById('compressedSize');
    const quality = document.getElementById('quality');
    const qualityValue = document.getElementById('qualityValue');
    const downloadBtn = document.getElementById('downloadBtn');

    let originalImage = null;

    // 上传区域点击事件
    uploadArea.addEventListener('click', () => fileInput.click());

    // 拖拽上传
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = '#0071e3';
    });

    uploadArea.addEventListener('dragleave', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = '#86868b';
    });

    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = '#86868b';
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFile(files[0]);
        }
    });

    // 文件选择事件
    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            handleFile(e.target.files[0]);
        }
    });

    // 质量滑块事件
    quality.addEventListener('input', (e) => {
        qualityValue.textContent = e.target.value + '%';
        if (originalImage) {
            compressImage(originalImage, e.target.value / 100);
        }
    });

    // 处理上传的文件
    function handleFile(file) {
        if (!file.type.match('image.*')) {
            alert('请上传图片文件！');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            originalImage = new Image();
            originalImage.onload = () => {
                originalPreview.src = e.target.result;
                originalSize.textContent = formatFileSize(file.size);
                compressImage(originalImage, quality.value / 100);
                previewArea.style.display = 'block';
            };
            originalImage.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    // 压缩图片
    function compressImage(img, quality) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        canvas.width = img.width;
        canvas.height = img.height;

        ctx.fillStyle = '#fff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);

        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        compressedPreview.src = compressedDataUrl;

        // 计算压缩后的大小
        const compressedSize = Math.round((compressedDataUrl.length - 'data:image/jpeg;base64,'.length) * 3/4);
        document.getElementById('compressedSize').textContent = formatFileSize(compressedSize);

        // 设置下载按钮
        downloadBtn.onclick = () => {
            const link = document.createElement('a');
            link.download = 'compressed-image.jpg';
            link.href = compressedDataUrl;
            link.click();
        };
    }

    // 格式化文件大小
    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
}); 