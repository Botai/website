var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var CategorySchema = new Schema({
    name: String,
    movies: [{type: ObjectId, ref: 'Movie'}],
    meta: {
        createAt: {
            type: Date,
            default: Date.now()
        },
        updateAt: {
            type: Date,
            default: Date.now()
        }
    }
});

CategorySchema.pre('save', function(next) {
    // 判断是否为新建，更改时间
    if(this.isNew) {
        this.meta.createAt = this.meta.updateAt = Date.now();
    }else {
        this.meta.updateAt = Date.now();
    }

    next();
});

CategorySchema.statics = {
    // 取出数据库所有的数据
    fetch: function(cb) {
        return this
            .find({})
            .sort('meta.updateAt')
            .exec(cb);
    },
    // 查询单条数据
    findById: function(id, cb) {
        return this
            .findOne({_id: id})
            .sort('meta.updateAt')
            .exec(cb);
    }
};

module.exports = CategorySchema;
