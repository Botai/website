var mongoose = require('mongoose');

var MovieSchema = new mongoose.Schema({
    doctor: String,
    title: String,
    language: String,
    country: String,
    summary: String,
    flash: String,
    poster: String,
    year: Number,
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

MovieSchema.pre('save', function(next) {
    // 判断是否为新建，更改时间
    if(this.isNew) {
        this.meta.createAt = this.meta.updateAt = Date.now();
    }else {
        this.meta.updateAt = Date.now();
    }

    next();
});

MovieSchema.statics = {
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

module.exports = MovieSchema;
