import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './CreateProject.css'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../../reducers/firebase';
import { getCategories } from '../../../services/category';
import { createPost } from '../../../services/post';

const CreateProject = ({ onClose }) => {
    const [images, setImages] = useState([]);
    const [editorHtml, setEditorHtml] = React.useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [title, setTitle] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);
    const [selectedCategories, setSelectedCategories] = useState({
        level2: null,
        level3: null,
        level4: null
    });

    // Fetch categories on component mount
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await getCategories('Project');
                const categoryList = response.data[0].children;
                setCategories(categoryList);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };
        fetchCategories();
    }, []);

    // Handle category changes
    const handleCategoryChange = (level, category) => {
        const newSelectedCategories = { ...selectedCategories };

        // Reset lower levels when changing a higher level
        switch (level) {
            case 2:
                newSelectedCategories.level2 = category;
                newSelectedCategories.level3 = null;
                newSelectedCategories.level4 = null;
                break;
            case 3:
                newSelectedCategories.level3 = category;
                newSelectedCategories.level4 = null;
                break;
            case 4:
                newSelectedCategories.level4 = category;
                break;
            default:
                break;
        }

        setSelectedCategories(newSelectedCategories);
    };

    // Render category selectors
    const renderCategorySelectors = () => {
        return (
            <div className="grid grid-cols-3 gap-4">
                {/* Level 2 Select */}
                <select
                    className="w-full p-2 border rounded-md"
                    value={selectedCategories.level2?.categoryId || ''}
                    onChange={(e) => {
                        const category = categories.find(c => c.categoryId === e.target.value);
                        handleCategoryChange(2, category);
                    }}
                >
                    <option value="">Chọn danh mục cấp 2</option>
                    {categories.map(cat => (
                        <option key={cat.categoryId} value={cat.categoryId}>
                            {cat.name}
                        </option>
                    ))}
                </select>

                {/* Level 3 Select */}
                <select
                    className="w-full p-2 border rounded-md"
                    value={selectedCategories.level3?.categoryId || ''}
                    onChange={(e) => {
                        const category = selectedCategories.level2?.children?.find(
                            c => c.categoryId === e.target.value
                        );
                        handleCategoryChange(3, category);
                    }}
                    disabled={!selectedCategories.level2}
                >
                    <option value="">Chọn danh mục cấp 3</option>
                    {selectedCategories.level2?.children?.map(cat => (
                        <option key={cat.categoryId} value={cat.categoryId}>
                            {cat.name}
                        </option>
                    ))}
                </select>

                {/* Level 4 Select */}
                <select
                    className="w-full p-2 border rounded-md"
                    value={selectedCategories.level4?.categoryId || ''}
                    onChange={(e) => {
                        const category = selectedCategories.level3?.children?.find(
                            c => c.categoryId === e.target.value
                        );
                        handleCategoryChange(4, category);
                    }}
                    disabled={!selectedCategories.level3 || !selectedCategories.level3.children?.length}
                >
                    <option value="">Chọn danh mục cấp 4</option>
                    {selectedCategories.level3?.children?.map(cat => (
                        <option key={cat.categoryId} value={cat.categoryId}>
                            {cat.name}
                        </option>
                    ))}
                </select>
            </div>
        );
    };

    const handleChange = (html) => {
        setEditorHtml(html);
    };

    const modules = {
        toolbar: [
            [{ header: [1, 2, false] }],
            ["bold", "italic", "underline", "link"],
            [{ list: "ordered" }, { list: "bullet" }],
            [{ align: [] }],
        ],
    };

    const handleImageUpload = (event) => {
        const files = Array.from(event.target.files);
        setImages(files);
    };

    const handleDeleteImage = (indexToDelete) => {
        setImages(prevImages => prevImages.filter((_, index) => index !== indexToDelete));
    };

    const handleSave = async () => {
        try {
            setIsUploading(true);
            const uploadPromises = images.map(async (image) => {
                const storageRef = ref(storage, `posts/${Date.now()}-${image.name}`);
                const snapshot = await uploadBytes(storageRef, image);
                return getDownloadURL(snapshot.ref);
            });

            const uploadedUrls = await Promise.all(uploadPromises);
            
            // Get the most specific category ID
            const finalCategoryId = selectedCategories.level4?.categoryId ||
                selectedCategories.level3?.categoryId ||
                selectedCategories.level2?.categoryId;

            const postData = {
                title: title,
                description: editorHtml,
                categoryId: finalCategoryId,
                images: uploadedUrls
            };

            await createPost(postData);
            onClose();
        } catch (error) {
            console.error('Error creating post:', error);
        } finally {
            setIsUploading(false);
        }
    };

    const handleDetailView = (image) => {
        setSelectedImage(image);
    };

    const handleCloseDetailView = () => {
        setSelectedImage(null);
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="fixed inset-0 bg-black bg-opacity-70" onClick={onClose}></div>
            <div className="relative bg-white rounded-lg shadow-2xl w-[1024px] h-[600px] border border-gray-600">
                <div className="px-6 py-4 border-b border-gray-500">
                    <h2 className="text-xl font-semibold text-black">Thêm sản phẩm mới</h2>
                </div>

                <div className="p-6 h-[calc(600px-8rem)] overflow-y-auto">
                    <div className="mb-4">
                        <h3 className="text-black text-sm font-medium mb-2">Tiêu Đề</h3>
                        <input
                            type="text"
                            className="w-full p-2 border rounded-md"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>

                    <div className="mb-4">
                        <h3 className="text-black text-sm font-medium mb-2">Danh mục</h3>
                        {renderCategorySelectors()}
                    </div>

                    <h3 className="text-black text-sm font-medium mb-2">Nội dung</h3>
                    <div>
                        <ReactQuill
                            value={editorHtml}
                            onChange={handleChange}
                            className="quill-editor"
                            modules={modules}
                        />
                    </div>

                    <div className="mb-6 mt-6">
                        <h3 className="text-black text-sm font-medium mb-2">Hình ảnh</h3>
                        <div>
                            <input
                                type="file"
                                multiple
                                onChange={handleImageUpload}
                            />
                            <div className="grid grid-cols-3 gap-4 mt-4">
                                {images.map((image, index) => (
                                    <div key={index} className="h-48 overflow-hidden relative group">
                                        <img
                                            src={URL.createObjectURL(image)}
                                            alt={`upload-${index}`}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                            <button
                                                onClick={() => handleDetailView(image)}
                                                className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full transition-colors"
                                                title="Xem chi tiết"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                            <button
                                                onClick={() => handleDeleteImage(index)}
                                                className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transition-colors"
                                                title="Xóa ảnh"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {selectedImage && (
                            <div
                                className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75"
                                onClick={handleCloseDetailView}
                            >
                                <div className="relative max-w-[90vw] max-h-[90vh]">
                                    <button
                                        className="absolute top-4 right-4 bg-white rounded-full p-2 hover:bg-gray-200"
                                        onClick={handleCloseDetailView}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                    <img
                                        src={URL.createObjectURL(selectedImage)}
                                        alt="Detail view"
                                        className="max-w-full max-h-[90vh] object-contain"
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="px-6 py-4 border-t border-gray-500 flex justify-end gap-3">
                    <button
                        className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-black transition-colors"
                        onClick={onClose}
                        disabled={isUploading}
                    >
                        Đóng
                    </button>
                    <button
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        onClick={handleSave}
                        disabled={isUploading}
                    >
                        {isUploading ? 'Đang tải lên...' : 'Lưu'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateProject;