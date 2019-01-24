//材质
color = function(r,g,b){
    this.r = r;
    this.g = g;
    this.b = b;
};

color.prototype = {
    copy:
        function(){
            return new color(this.r,this.g,this.b);
        },
    add:
        function (c) {
            return new color(this.r + c.r,this.g+c.g,this.b+c.b);
        },
    multiply:
        function (s) {
            return new color(this.r*s,this.g*s,this.b*s);
        },
    modulate:
        function(c){
            return new color(this.r * c.r, this.g * c.g, this.b * c.b);
        }
};

color.black = new color(0, 0, 0);
color.white = new color(1, 1, 1);
color.red = new color(0.9, 0.2, 0.2);
color.green = new color(0, 1, 0);
color.blue = new color(0, 0, 1);

//测试材质，棋盘格
checkerMaterial = function(scale,reflectiveness){
  this.scale = scale;
  this.reflectiveness = reflectiveness;
};

checkerMaterial.prototype = {
    sample:
        function(ray,position,normal){
            var wasted = (Math.floor(position.x*0.1)+Math.floor(position.z*this.scale))%2;
            return Math.abs(wasted)<1?color.red:color.blue;
        }
};

//Phong反射模型
phongMaterial = function(diffuse,specular,shininess,reflectiveness){
    this.diffuse        = diffuse;
    this.specular       = specular;
    this.shininess      = shininess;
    this.reflectiveness = reflectiveness;
};

var lightDir   = new vector3(1,1,1).normalize();
var lightColor = color.white;

phongMaterial.prototype = {
    sample:
        function(ray,position,normal){
            var NdotL = normal.dot(lightDir);
            var H = (lightDir.subtract(ray.direction)).normalize();
            var NdotH = normal.dot(H);
            var diffuseTerm  = this.diffuse.multiply(Math.max(NdotL),0);
            var specularTerm = this.specular.multiply(Math.pow(Math.max(NdotH,0),this.shininess));
            return lightColor.modulate(diffuseTerm.add(specularTerm));
        }
};
















