import { motion } from "framer-motion";
import { Edit, Search, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import CreatePost from "./createPost/CreatePost";
import PostDetail from "./postDetail/PostDetail";
import { getPosts, getPost, deletePost } from "../../services/post";
import { deleteImages } from '../../reducers/firebase';

const PostTable = () => {

	const [page, setPage] = useState([]);
	const [searchTerm, setSearchTerm] = useState("");
	const [filteredPosts, setfilteredPosts] = useState([]);
	const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
	const [isPostDetailOpen, setIsPostDetailOpen] = useState(false);
	const [selectedPostId, setSelectedPostId] = useState(null);

	useEffect(() => {
		const fetchPosts = async () => {
			console.log('Fetching books');
			const response = await getPosts(1, 5, 'Post');
			const result = await response.data;

			setfilteredPosts(result.data.items);
			setPage({
				pageNumber: result.data.pageNumber,
				pageSize: result.data.pageSize,
				totalCount: result.data.totalCount,
				totalPages: result.data.totalPages,
				hasNext: result.data.hasNext,
				hasPrevious: result.data.hasPrevious
			});
		};

		fetchPosts();
	}, []);


	const handlerPageChange = async (value) => {
		try {
			console.log(value);
			const response = await getPosts(value, 5, 'Post'); // Gọi lại API với trang mới
			const result = await response.data;

			setfilteredPosts(result.data.items);
			setPage({
				pageNumber: result.data.pageNumber,
				pageSize: result.data.pageSize,
				totalCount: result.data.totalCount,
				totalPages: result.data.totalPages,
				hasNext: result.data.hasNext,
				hasPrevious: result.data.hasPrevious,
			});
			window.scrollTo(0, 0);
		} catch (error) {
			console.error('Error fetching posts:', error);
		}
	};


	const handleSearch = (e) => {
		const term = e.target.value.toLowerCase();
		setSearchTerm(term);
		const filtered = filteredPosts.filter(
			(post) => post.name.toLowerCase().includes(term) || post.category.toLowerCase().includes(term)
		);
		setfilteredPosts(filtered);
	};

	const handleDeletePost = async (postId) => {
		if (window.confirm('Bạn có chắc muốn xóa bài đăng này không?')) {
			try {

				const response = await getPost(postId);
				const projectData = response.data.data;

				if (projectData.images !== null) {
					deleteImages(projectData.images);
				}

				await deletePost(postId);
				setfilteredPosts((prevProjects) =>
					prevProjects.filter((project) => project.postId !== postId)
				);
				alert('Xóa bài đăng thành công!');
			} catch (error) {
				console.error('Error deleting post:', error);
				alert('Xóa bài đăng thất bại!');
			}
		}
	};


	const openCreatePost = () => {
		setIsCreatePostOpen(true);
	};

	const closeCreatePost = () => {
		setIsCreatePostOpen(false);
	};

	const openPostDetail = (postId) => {
		setSelectedPostId(postId);
		setIsPostDetailOpen(true);
	};

	const closePostDetail = () => {
		setSelectedPostId(null);
		setIsPostDetailOpen(false);
	};

	return (
		<motion.div
			className='bg-white  shadow-lg rounded-xl p-6 border border-gray-700 mb-8'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.2 }}
		>
			<div className='flex justify-between items-center mb-6'>
				<h2 className='text-xl font-semibold text-black'>Quản Lý Bài Đăng</h2>
				<div className='relative'>
					<input
						type='text'
						placeholder='Search posts...'
						className='bg-blacktext-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
						onChange={handleSearch}
						value={searchTerm}
					/>
					<Search className='absolute left-3 top-2.5 text-white' size={18} />
				</div>
			</div>

			<div className='overflow-x-auto'>
				<table className='min-w-full divide-y divide-gray-700'>
					<thead>
						<tr>
							<th className='px-6 py-3 text-left text-xs font-medium text-blackuppercase tracking-wider'>
								Tiêu đề
							</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-blackuppercase tracking-wider'>
								Loại
							</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-blackuppercase tracking-wider'>
								Ngày Đăng
							</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-blackuppercase tracking-wider'>

							</th>
						</tr>
					</thead>

					<tbody className='divide-y divide-gray-700'>
						{filteredPosts.map((post) => (
							<motion.tr
								key={post.postId}
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ duration: 0.3 }}
							>
								<td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-black flex gap-2 items-center'>
									<img
										src='https://images.unsplash.com/photo-1627989580309-bfaf3e58af6f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8d2lyZWxlc3MlMjBlYXJidWRzfGVufDB8fDB8fHww'
										alt='post img'
										className='size-10 rounded-full'
									/>
									{post.title}
								</td>

								<td className='px-6 py-4 whitespace-nowrap text-sm text-black'>
									{post.categoryName}
								</td>
								<td className='px-6 py-4 whitespace-nowrap text-sm text-black'>{post.createDate}</td>
								<td className='px-6 py-4 whitespace-nowrap text-sm text-black'>
									<button
										className='text-indigo-400 hover:text-indigo-300 mr-2'
										onClick={() => openPostDetail(post.postId)}
									>
										<Edit size={18} />
									</button>
									<button
										className='text-red-400 hover:text-red-300'
										onClick={() => handleDeletePost(post.postId)}>
										<Trash2 size={18} />
									</button>
								</td>
							</motion.tr>
						))}
						<tr>
							<td colSpan="4" className='px-6 py-4 whitespace-nowrap text-sm text-black text-center'>
								<button className='text-blue-700 hover:text-blue-500' onClick={openCreatePost}>
								+ Thêm bài đăng mới
								</button>
							</td>
						</tr>
						{isCreatePostOpen && <CreatePost onClose={closeCreatePost} />}
					</tbody>
				</table>

				<div className="flex justify-between items-center mt-4 px-6">
					<div className="text-sm text-white">
						Showing {page.pageNumber * page.pageSize - 4} to {page.pageNumber * page.pageSize} of {page.totalCount} entries
					</div>
					<div className="flex gap-2">
						<button
							onClick={() => handlerPageChange(page.pageNumber - 1)}
							disabled={!page.hasPrevious}
							className="p-2 rounded-lg bg-black text-white disabled:cursor-not-allowed"
						>
							<ChevronLeft size={18} />
						</button>
						<span className="flex items-center px-4 text-black">
							Page {page.pageNumber} of {page.totalPages}
						</span>
						<button
							onClick={() => handlerPageChange(page.pageNumber + 1)}
							disabled={!page.hasNext}
							className="p-2 rounded-lg bg-black text-white disabled:cursor-not-allowed"
						>
							<ChevronRight size={18} />
						</button>
					</div>
				</div>
			</div>
			{isPostDetailOpen && (
				<PostDetail
					postId={selectedPostId}
					onClose={closePostDetail}
				/>
			)}
		</motion.div>
	);
};
export default PostTable;
