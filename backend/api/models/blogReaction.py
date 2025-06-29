from django.db import models
from .user import User
from .blogs import Blog

class BlogReaction(models.Model):
    REACTION_CHOICES = [
        ('like', 'Like'),
        ('dislike', 'Dislike')
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="blog_reactions")
    blog = models.ForeignKey(Blog, on_delete=models.CASCADE, related_name="reactions")
    reaction_type = models.CharField(max_length=10, choices=REACTION_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'blog')

    def __str__(self):
        return f"{self.user.email} {self.reaction_type}d {self.blog.title}"