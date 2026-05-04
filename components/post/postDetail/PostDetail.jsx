import React, { useState, useMemo, useRef, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './PostDetail.css'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../../reducers/firebase';
import { getCategories } from '../../../services/category';
import { updatePost, getPost } from '../../../services/post';

const PostDetail = ({ postId, onClose }) => {
	const [postData, setPostData] = useState({
		id: '',
		title: '',
		description: '',
		categoryId: '',
		categoryName: '',
		image: ''
	});

	const [images, setImages] = useState([]);
	const [editorHtml, setEditorHtml] = useState('');
	const [isUploading, setIsUploading] = useState(false);
	const [categories, setCategories] = useState([]);
	const [error, setError] = useState(null);
	const quillRef = useRef(null);
	const [isLoading, setIsLoading] = useState(true);


	// Fetch initial data
	useEffect(() => {
		const fetchData = async () => {
			try {
				setIsLoading(true);
				// Fetch post data
				if (postId) {
					const response = await getPost(postId);
					const data = response.data.data;

					setPostData({
						id: data.postId,
						title: data.title,
						description: data.description,
						categoryId: data.categoryId,
						categoryName: data.categoryName,
						image: data.images[0]
					});

					// Set editor content
					setEditorHtml(data.description || '');
				}

				// Fetch categories
				const categoriesResponse = await getCategories('post');
				setCategories(categoriesResponse.data[0].children);
			} catch (error) {
				console.error('Error fetching data:', error);
				setError('Failed to load data. Please try again.');
			} finally {
				setIsLoading(false);
			}
		};

		fetchData();
	}, [postId]);

	const imageHandler = () => {
		const input = document.createElement('input');
		input.setAttribute('type', 'file');
		input.setAttribute('accept', 'image/*');
		input.click();

		input.onchange = async () => {
			const file = input.files[0];
			if (!quillRef.current || !file) return;

			const quill = quillRef.current.getEditor();
			const range = quill.getSelection(true);

			try {
				setIsUploading(true);
				const storageRef = ref(storage, `posts/${Date.now()}-${file.name}`);
				const snapshot = await uploadBytes(storageRef, file);
				const url = await getDownloadURL(snapshot.ref);

				quill.insertEmbed(range.index, 'image', url);
				quill.setSelection(range.index + 1);
			} catch (error) {
				console.error('Error uploading image:', error);
				setError('Failed to upload image. Please try again.');
			} finally {
				setIsUploading(false);
			}
		};
	};

	const modules = useMemo(() => ({
		toolbar: {
			container: [
				[{ 'header': [1, 2, 3, false] }],
				['bold', 'italic', 'underline', 'link'],
				[{ list: 'ordered' }, { list: 'bullet' }],
				[{ align: [] }],
				['image']
			],
			handlers: {
				image: imageHandler
			}
		}
	}), []);

	const handleImageUpload = async (event) => {
		const files = Array.from(event.target.files);
		if (files.length === 0) return;

		try {
			setIsUploading(true);
			const file = files[0]; // Take only the first image since it's a single image post
			const storageRef = ref(storage, `posts/${Date.now()}-${file.name}`);
			const snapshot = await uploadBytes(storageRef, file);
			const url = await getDownloadURL(snapshot.ref);

			setPostData(prev => ({
				...prev,
				image: url
			}));
			setImages([file]); // Update preview
		} catch (error) {
			console.error('Error uploading image:', error);
			setError('Failed to upload image. Please try again.');
		} finally {
			setIsUploading(false);
		}
	};

	const handleSave = async () => {
		try {
			setIsUploading(true);
			setError(null);

			if (!postData.title.trim()) {
				setError('Title is required');
				return;
			}

			const updatedPostData = {
				...postData,
				description: editorHtml,
				title: postData.title,
				categoryId: postData.categoryId,
				images: postData.image ? [postData.image] : [] // Ensure images is always an array
			};

			await updatePost(postData.id, updatedPostData);
			onClose();
		} catch (error) {
			console.error('Error updating post:', error);
			setError('Failed to update post. Please try again.');
		} finally {
			setIsUploading(false);
		}
	};

	if (isLoading) {
		return (
			<div className="fixed inset-0 flex items-center justify-center z-50">
				<div className="fixed inset-0 bg-black bg-opacity-70"></div>
				<div className="relative bg-white rounded-lg shadow-2xl w-[1024px] h-[600px] border border-gray-600 flex items-center justify-center">
					<div className="text-center">
						<div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
						<p className="text-gray-600">Đang tải dữ liệu...</p>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="fixed inset-0 flex items-center justify-center z-50">
			<div className="fixed inset-0 bg-black bg-opacity-70" onClick={onClose}></div>

			<div className="relative bg-white rounded-lg shadow-2xl w-[90vw] h-[90vh] border border-gray-600">
				<div className="px-6 py-4 border-b border-gray-500 flex justify-between items-center">
					<h2 className="text-xl font-semibold text-black">Chi Tiết Bài Đăng</h2>
				</div>

				<div className="p-6 h-[calc(90vh-8rem)] overflow-y-auto">
					{error && (
						<div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
							{error}
						</div>
					)}

					<div className="grid grid-cols-2 gap-6">
						<div>
							<div className="mb-4">
								<h3 className="text-blacktext-sm font-medium mb-2">Tiêu Đề</h3>
								<input
									type="text"
									className="w-full p-2 border-gray-300 rounded-md text-black focus:outline-none"
									value={postData.title}
									onChange={(e) => setPostData(prev => ({ ...prev, title: e.target.value }))}
								/>
							</div>

							<div className="mb-6 mt-6">
								<h3 className="text-blacktext-sm font-medium">Hình ảnh</h3>
								<div>
									<input
										type="file"
										onChange={handleImageUpload}
										accept="image/*"
									/>
									<div className="grid grid-cols-3 gap-4 mt-4">
										{postData.image && (
											<div className="h-48 overflow-hidden">
												<img
													src={postData.image}
													alt="Post"
													className="w-full h-full object-cover"
												/>
											</div>
										)}
									</div>
								</div>
							</div>

							<div className="mb-4">
								<h3 className="text-blacktext-sm font-medium mb-2">Danh mục</h3>
								<select
									className="w-full p-2 border-gray-300 rounded-md text-black focus:outline-none"
									value={postData.categoryId}
									onChange={(e) => setPostData(prev => ({ ...prev, categoryId: e.target.value }))}
								>
									<option value="">Chọn danh mục</option>
									{categories.map((category) => (
										<option key={category.categoryId} value={category.categoryId}>
											{category.name}
										</option>
									))}
								</select>
							</div>
						</div>

						<div className="preview-container">
							<div className="flex flex-col h-screen">
								<ReactQuill
									ref={quillRef}
									value={editorHtml}
									onChange={setEditorHtml}
									modules={modules}
									className="flex-1"
									style={{
										display: 'flex',
										flexDirection: 'column',
										minHeight: '800px' // Đảm bảo chiều cao tối thiểu
									}}
								/>
							</div>
						</div>
					</div>
				</div>

				<div className="px-6 py-4 border-t border-gray-500 flex justify-end gap-3">
					<button
						className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-blacktransition-colors"
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

export default PostDetail;