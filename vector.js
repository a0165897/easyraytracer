//基本数据类型
vector3 = function(x,y,z){
    this.x = x;
    this.y = y;
    this.z = z;
};
vector3.zero = new vector3(0,0,0);
vector3.prototype={
    copy:
        function() {
            return new vector3(this.x, this.y, this.z);
        },
    length:
        function(){
            return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z);
        },
    sqrlength:
        function(){
            return this.x*this.x+this.y*this.y+this.z*this.z;
        },
    normalize:
        function(){
            var inv = 1/this.length();
            return new vector3(this.x*inv,this.y*inv,this.z*inv);
        },
    negate:
        function(){
            return new vector3(-this.x,-this.y,-this.z);
        },
    add:
        function(v){
            return new vector3(this.x+v.x,this.y+v.y,this.z+v.z);
        },
    subtract:
        function(v){
            return new vector3(this.x-v.x,this.y-v.y,this.z-v.z);
        },
    multiply:
        function(f){
            return new vector3(this.x*f,this.y*f,this.z*f);
        },
    divide:
        function(v){
            var invf = 1/f;
            return new vector3(this.x-v.x,this.y-v.y,this.z-v.z);
        },
    dot:
        function(v){
            return this.x*v.x+this.y*v.y+this.z*v.z;
        },
    cross:
        function(v){
            return new vector3(-this.z * v.y + this.y * v.z, this.z * v.x - this.x * v.z, -this.y * v.x + this.x * v.y);
        }
};

