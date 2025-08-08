document.addEventListener('DOMContentLoaded', () => {
    document.body.addEventListener('click', async (event) => {
        if (event.target.classList.contains('button-delete')) {
            const postId = event.target.dataset.id;
            const confirmDelete = confirm('Are you sure you want to delete this post?');

            if (confirmDelete) {
                try {
                    const response = await fetch(`/news/${postId}`, {
                        method: 'DELETE'
                    });

                    if (response.ok) {
                        event.target.closest('.news-post').remove();
                    } else {
                        alert('Error deleting post.');
                    }
                } catch (error) {
                    console.error('Fetch error:', error);
                    alert('An error occurred. Could not delete post.');
                }
            }
        }
    });
});