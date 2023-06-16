const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

// get all products
router.get('/', async (req, res) => {
  try {
    // find all products
    const product = await Product.findAll({
      attributes: ["id", "product_name", "price", "stock", "category_id"],
      // be sure to include its associated Category and Tag data
      includes: [
        {
          model: Category,
          attributes: ["id", "category_name"],
        },
        {
          model: Tag,
          attributes: ["id", "tag_name"],
        },
      ],
    });
    console.log(product, "hi");
    res.status(200).json(product);
  } catch (err) {
    res.status(400).json(err);
  }
});

// get one product
router.get('/:id', async (req, res) => {
  try {
    // find a single product by its `id`
    const product = await Product.findOne({
      where: {
        id: req.params.id,
      },
      attributes: ["id", "product_name", "price", "stock", "category_id"],
      // be sure to include its associated Category and Tag data
      include: [
        {
          model: Category,
          attributes: ["id", "category_name"],
        },
        {
          model: Tag,
          attributes: ["id", "tag_name"],
        },
      ],
    })
    res.status(200).json(product);
  } catch (err) {
    res.status(400).json(err);
  }
});

// create new product
router.post('/', async (req, res) => {
  /* req.body should look like this...
    {
      product_name: "Basketball",
      price: 200.00,
      stock: 3,
      tagIds: [1, 2, 3, 4]
    }
  */
  try {
    const product = await Product.create(req.body);
    // if there's product tags, we need to create pairings to bulk create in the ProductTag model
    if (req.body.tagIds.length) {
      const productTagIdArr = req.body.tagIds.map((tag_id) => {
        return {
          product_id: product.id,
          tag_id,
        };
      });
      const productTagIds = await ProductTag.bulkCreate(productTagIdArr);
      res.status(200).json(productTagIds);
    } else {// if no product tags, just respond
      res.status(200).json(product);
    }
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  };
});

// update product
router.put('/:id', async (req, res) => {
  try {
    // update product data
    const product = await Product.update(req.body, {
      where: {
        id: req.params.id,
      },
    })
    // if not found, log this message
    if (!product[0]) {
      res.status(404).json({ message: 'There are no product found with that id!' });
      return;
    } else {
      if (req.body.tagIds && req.body.tagIds.length) {
        // find all associated tags from ProductTag
        const productTags = await ProductTag.findAll({
          where: {
            product_id: req.params.id
          }
        });
        // get list of current tag_ids
        const productTagIds = productTags.map(({ tag_id }) => tag_id);
        // create filtered list of new tag_ids
        const newProductTags = req.body.tagIds
          .filter((tag_id) => !productTagIds.includes(tag_id))
          .map((tag_id) => {
            return {
              product_id: req.params.id,
              tag_id,
            };
          });
        // figure out which ones to remove
        const productTagsToRemove = productTags
          .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
          .map(({ id }) => id);

        // run both actions
        const updatedProductTags = [
          await ProductTag.destroy({ where: { id: productTagsToRemove } }),
          await ProductTag.bulkCreate(newProductTags),
        ];
        res.status(200).json(updatedProductTags);
      } else {
        return res.status(200).json(product);
      }
    }
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  };
});

router.delete('/:id', async (req, res) => {
  try {
    // delete one product by its `id` value
    const product = await Product.destroy({
      where: {
        id: req.params.id,
      },
    });
    if (!product) {
      res.status(404).json({ message: 'There are no product found with that id!' });
      return;
    }
    res.status(200).json(product);
  } catch (err) {
    res.status(400).json(err);
  }
});

console.log("hello");



module.exports = router;
