const ArticleService = require("../Services/ArticleService");

class ArticleController {
  async getAllArticles(req, res) {
    try {
      const Articles = await ArticleService.getAllArticles();
      res.json(Articles);
    } catch (error) {
      res.status(500).json({ error: "Erreur lors de la récupération des Articles" });
    }
  }

  async getArticleById(req, res) {
    try {
      const Article = await ArticleService.getArticleById(req.params.id);
      if (!Article) return res.status(404).json({ error: "Article non trouvée" });
      res.json(Article);
    } catch (error) {
      res.status(500).json({ error: "Erreur lors de la récupération de la Article" });
    }
  }

  async addArticle(req, res) {
    try {
      const Article = await ArticleService.addArticle(req.body);
      res.status(201).json(Article);
    } catch (error) {
      res.status(500).json({ error: "Erreur lors de l'ajout de la Article" });
    }
  }

  async updateArticle(req, res) {
    try {
      const Article = await ArticleService.updateArticle(req.params.id, req.body);
      if (!Article) return res.status(404).json({ error: "Article non trouvée" });
      res.json(Article);
    } catch (error) {
      res.status(500).json({ error: "Erreur lors de la mise à jour de la Article" });
    }
  }

  async deleteArticle(req, res) {
    try {
      const Article = await ArticleService.deleteArticle(req.params.id);
      if (!Article) return res.status(404).json({ error: "Article non trouvée" });
      res.json({ message: "Article supprimée avec succès" });
    } catch (error) {
      res.status(500).json({ error: "Erreur lors de la suppression de la Article" });
    }
  }
}

module.exports = new ArticleController();
