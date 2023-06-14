const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

router.get('/', async (req, res) => {
  try {
    // find all categories
    const category = await Category.findAll({
      attributes: [],
      // be sure to include its associated Products
      includes: [],
    })
    res.status(200).json(data);
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
      attributes: [],
      // be sure to include its associated Products
      includes: [{
        model: Product,
        attributes: [],
      }]
    });
    res.status(200).json(data);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.post('/', async (req, res) => {
  try {
    // create a new Category
    const category = await Category.create({
      Category_name: req.body.Category_name
    });
    res.status(200).json(data);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.put('/:id', async (req, res) => {
  try {
    // update a Category by its `id` value
    const category = await Category.update(req, res, {
      where: {
        id: req.params.id,
      },
    })
    res.status(200).json(data);
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
    })
    res.status(200).json(data);
  } catch (err) {
    res.status(400).json(err);
  }
});

module.exports = router;
