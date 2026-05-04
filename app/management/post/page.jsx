import PostTable from './../components/post/PostTable';
const PostPage = () => {
	return (
		<div className='flex-1 overflow-auto relative z-10 bg-zinc-200'>
			<main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
				<PostTable />
			</main>
		</div>
	);
};
export default PostPage;
