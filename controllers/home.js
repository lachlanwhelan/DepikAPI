const handleImages = (req, res, db) => {

    db.select('user.name', 'image_id', 'images.image_url', 'images.tag', 'images.category')
    .from('images').innerJoin('user', 'images.user_id', '=', 'user.id')
    .then(data => {
        const images = data.map(imageItem => {
            return {
                id: imageItem.image_id,
                name: imageItem.name,
                url: `https://rocky-earth-38750.herokuapp.com/${imageItem.image_url}`,
                tag: imageItem.tag,
                category: imageItem.category
            }
        })
        res.json(images);
    })
}

const handleImageSearch = (req, res, db) => {
      //use req.query to retreive query strings 
    if(req.query){
        db.select('user.name', 'images.image_url', 'images.tag', 'images.category')
        .from('images').innerJoin('user', 'images.user_id', '=', 'user.id')
        .where('images.tag', 'like', `%${req.query.q}%`)
        .then(data => {
            const images = data.map(imageItem => {
                return {
                    name: imageItem.name,
                    url: `https://rocky-earth-38750.herokuapp.com/${imageItem.image_url}`,
                    tag: imageItem.tag,
                    category: imageItem.category
                }
            })
            res.json(images);
        })
        .catch(err => res.status(400).json('something went wrong with search'))
    }
    else{
        res.status(400).json('error');
    }
}

const handleImageUpload = (req, res, db) => {
   const {tag, category, id} = req.body;
    
   db('images')
     .returning('*')
     .insert({
       image_url: req.file.path, //makes it available in req.file
       tag: tag,
       category: category,
       user_id: id
    }).then(image => {
        res.json(image);
    })
    .catch(err => {
       res.status(400).json('error uploading')
    }) 
}

const handleDelete = (req, res, db) => {
    db('images')
    .where('image_id', req.body.id)
    .del()
    .then(res.json('image deleted'))
    .catch(err => res.status(400).json('error deleting'))
}

module.exports = {
    handleImages: handleImages,
    handleImageSearch: handleImageSearch,
    handleImageUpload: handleImageUpload,
    handleDelete: handleDelete
}