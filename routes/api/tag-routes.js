const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

router.get('/', async (req, res) => {
  // find all tags
  try {
    const tag = await Tag.findAll({
      attributes: ["id", "tag_name"],
      // be sure to include its associated Product data
      include: [
        {
          model: Product,
          attributes: ["id", "product_name", "price", "stock", "category_id"],
        },
      ],
    });
    res.status(200).json(tag);
  } catch(err) {
    res.status(400).json(err);
  }
});

router.get('/:id', async (req, res) => {
  // find a single tag by its `id`
  try {
    const tag = await Tag.findOne({
      where: {
        id: req.params.id,
      },
      attributes: ["id", "tag_name"],
      // be sure to include its associated Product data
      include: [
        {
          model: Product,
          attributes: ["id", "product_name", "price", "stock", "category_id"]
        }],
    });
    if (!tag) {
      res.status(404).json({message: 'No tag found with that id!'});
      return;
    }
    res.status(200).json(tag);
  } catch (err) {
    res.status(400).json(err);
  } 
});

router.post('/', async (req, res) => {
  // create a new tag
  try {
    const tag = await Tag.create({
      where: {
        id: req.params.id,
      }
    });
    res.status(200).json(tag);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.put('/:id', async (req, res) => {
  // update a tag's name by its `id` value
  try {
    const tag = await Tag.update(req.body, {
      where: {
        id: req.params.id,
      }
    });
    if (!tag) {
      res.status(404).json({message: 'No tag found with that id!'});
      return;
    }
    res.status(200).json(tag);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.delete('/:id', async (req, res) => {
  // delete on tag by its `id` value
  try {
    const tag = await Tag.destroy({
      where: {
        id: req.params.id,
      }
    })
    if (!tag) {
      res.status(404).json({message: 'No tag found with that id!'});
      return;
    }
    res.status(200).json(tag);
  } catch (err) {
    res.status(400).json(err);
  }
});

module.exports = router;
