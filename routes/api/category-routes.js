const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

router.get('/', async (req, res) => {
  try {
    // find all categories
    const category = await Category.findAll({
      attributes: ["id", "category_name"],
      // be sure to include its associated Products
      includes: [{
          model: Product,
          attributes: ["id", "product_name", "price", "stock", "category_id"],
        }],
    });
    res.status(200).json(category);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.get('/:id', async (req, res) => {
  try {
    // find one Category by its `id` value
    const category = await Category.findOne({
      where: {
        id: req.params.id,
      },
      attributes: ["id", "category_name"],
      // be sure to include its associated Products
      includes: [{
        model: Product,
        attributes: ["id", "product_name", "price", "stock", "category_id"],
      }]
    });
    if (!category) {
      res.status(404).json({message: 'No category found with that id!'});
      return;
    }
    res.status(200).json(category);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.post('/', async (req, res) => {
  try {
    // create a new Category
    const category = await Category.create(req.body);
    res.status(200).json(category);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.put('/:id', async (req, res) => {
  try {
    // update a Category by its `id` value
    const category = await Category.update(req.body, {
      where: {
        id: req.params.id,
      },
    });
    if (!category) {
      res.status(404).json({message: 'No category found with that id!'});
      return;
    }
    res.status(200).json(category);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.delete('/:id', async (req, res) => {
  try {
    // delete a Category by its `id` value
    const category = await Category.destroy({
      where: {
        id: req.params.id,
      },
    });
    if (!category) {
      res.status(404).json({message: 'No category found with that id!'});
      return;
    }
    res.status(200).json(category);
  } catch (err) {
    res.status(400).json(err);
  }
});

module.exports = router;
