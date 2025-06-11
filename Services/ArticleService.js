const Article = require("../Models/Article");

class ArticleService {
  async getAllArticles() {
    return await Article.findAll();
  }

  async getArticleById(id) {
    return await Article.findByPk(id);
  }

  async addArticle(data) {
    return await Article.create(data);
  }

  async updateArticle(id, data) {
    const Article = await Article.findByPk(id);
    if (!Article) return null;
    return await Article.update(data);
  }

  async deleteArticle(id) {
    const Article = await Article.findByPk(id);
    if (!Article) return null;
    return await Article.destroy();
  }
}

module.exports = new ArticleService();
