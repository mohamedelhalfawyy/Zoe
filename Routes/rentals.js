const express = require('express');
const router = express.Router();
const { Rental, validate } = require('../Models/rentalModel');
const {Customer} = require('../Models/customerModel');
const {Movie} = require('../Models/movieModel');


router.get('/', async (req, res) => {
    const rentals = await Rental.find().sort('-dateOut');
    res.send(rentals);
});

router.post('/', async (req, res) => {
    const {error} = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    if (mongoose.Types.ObjectId.isValid(req.body.custoemrId))
        return res.status(400).send('Invalid Customer');

    const customer = await Customer.findById(req.body.customerId);
    if (!customer) return res.status(400).send('Invalid Customer!');

    const movie = await Movie.findById(req.body.movieId);
    if (!movie) return res.status(400).send('Invalid Movie!');

    if(movie.numberInStock === 0) return res.status(400).send('Movie not In Stock!');

    let rental = new Rental({
        customer: {
            _id: customer._id,
            name: customer.name,
            phone: customer.phone,
        },
        movie: {
            _id: movie._id,
            title: movie.title,
            dailyRentalRate: movie.dailyRentalRate
        }
    });

    let session = null;
    try {
        Rental.createCollection()
            .then(() => Rental.startSession())
            .then(_session =>  {
                session = _session;
                session.startTransaction();

                return rental.save();
            })
            .then(() => {
                movie.numberInStock--;
                movie.save();
            })
            .then(() => session.commitTransaction())
            .then(() => session.endSession())
            .then(() => res.send(rental));
    }catch (e) {
        res.status(500).send('Something Failed');
    }
});

router.put('/:id', async (req, res) => {
    const {error} = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const rental = await Rental.findByIdAndUpdate(req.params.id, {name: req.body.name}, {new: true});

    if (!rental) return res.status(400).send('The genre with the given ID does not exist');

    res.send(rental);
});

router.delete('/:id', async(req, res) => {
    const rental = await Rental.findByIdAndRemove(req.params.id);

    if (!rental) return res.status(400).send('The genre with the given ID does not exist');

    res.send(rental);
});

router.get('/:id', async (req, res) => {
    const rental = await Rental.findById(req.params.id);

    if (!rental) return res.status(400).send('The genre with the given ID does not exist');

    res.send(rental);
});



module.exports = router;