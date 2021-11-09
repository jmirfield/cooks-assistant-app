const mongoose = require('mongoose')
const { Schema } = mongoose
const validator = require('validator')

const IngredientSchema = new Schema({
    amount: {
        type: Number,
        required: 'Amount can\'t be empty'
    },
    amountType: {
        type: String,
        trim: true
    },
    ingredient: {
        type: String,
        required: 'Ingredient can\'t be empty',
        trim: true
    }
})

const InstructionSchema = new Schema({
    instruction: {
        type: String,
        required: 'Instruction can\'t be empty',
        trim: true
    }
})

const SavedURLSchema = new Schema({
    URL: {
        type: String,
        validate(val){
            if(!validator.isURL(val))throw new Error('Invalid URL')
        }
    },
    description: {
        type: String,
        trim: true
    }
})

const Recipe = mongoose.model('Recipe', {
    name: {
        type: String,
        required: true,
        trim: true
    },
    ingredients: [IngredientSchema],
    instructions: [InstructionSchema],
    notes: {
        type: String,
        trim: true
    },
    savedUrls: [SavedURLSchema]
})

module.exports = Recipe