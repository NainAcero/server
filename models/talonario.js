const { Schema, model } = require('mongoose');

const TalonarioSchema = Schema({
    talonario: {
        type: Array,
        required: true,
        default: 'USER_ROLE'
    },
    usuario_id: {
        type: Schema.ObjectId,
        required: true
    }
});

TalonarioSchema.method('toJSON', function() {
    const { __v, _id, ...object } = this.toObject();
    object.uid = _id;
    return object;
});

module.exports = model('Talonario', TalonarioSchema)