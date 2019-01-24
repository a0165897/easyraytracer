//光线
ray3 = function(origin,direction){
    this.origin    = origin;
    this.direction = direction;
};

ray3.prototype = {
    getPoint:
        function(t){
            return this.origin.add(this.direction.multiply(t));
        }
};

IntersectResult = function() {//记录交点信息
    this.geometry = null;
    this.distance = 0;
    this.position = vector3.zero;
    this.normal = vector3.zero;
};
IntersectResult.noHit = new IntersectResult();

//球体
sphere = function (center,radius){
    this.center = center;
    this.radius = radius;
};

sphere.prototype = {
    copy:
        function(){
            return new Sphere(this.center.copy(),this.radius.copy());
        },
    initialize:
        function(){
            this.sqrRadius = this.radius * this.radius;
        },
    // 求光线和球的交点，用球面方程求二元一次方程解
    // get the intersection of shpere and ray ,with the equation (-b-sqr(b*b-4*a*c))/2a
    intersect:
        function(ray){

            var v     = ray.origin.subtract(this.center);//v=o-c
            var a0    = v.sqrlength()-this.sqrRadius;//v*v-r*r
            var DdotV = ray.direction.dot(v);

            if(DdotV<=0){
                var discr = DdotV*DdotV -a0;
                if(discr>=0){
                    var result = new IntersectResult();
                    result.geometry = this;
                    // sphere:||x-c|| = r  ray: f(t) = o+t*d
                    result.distance = -DdotV-Math.sqrt(discr);//t
                    result.position = ray.getPoint(result.distance);
                    result.normal = result.position.subtract(this.center).normalize();
                    return result;
                }
            }

            return IntersectResult.noHit;
        }
};

//平面
Plane = function(normal, d) { this.normal = normal; this.d = d; };

Plane.prototype = {
    copy : function() { return new Plane(this.normal.copy(), this.d); },

    initialize : function() {
        this.position = this.normal.multiply(this.d);
    },

    intersect : function(ray) {
        var a = ray.direction.dot(this.normal);
        if (a >= 0)
            return IntersectResult.noHit;

        var b = this.normal.dot(ray.origin.subtract(this.position));
        var result = new IntersectResult();
        result.geometry = this;
        result.distance = -b / a;
        result.position = ray.getPoint(result.distance);
        result.normal = this.normal;
        return result;
    }
};

Union = function(geometries) { this.geometries = geometries; };

Union.prototype = {
    initialize: function() {
        for (var i in this.geometries)
            this.geometries[i].initialize();
    },

    intersect: function(ray) {
        var minDistance = Infinity;
        var minResult = IntersectResult.noHit;
        for (var i in this.geometries) {
            var result = this.geometries[i].intersect(ray);
            if (result.geometry && result.distance < minDistance) {
                minDistance = result.distance;
                minResult = result;
            }
        }
        return minResult;
    }
};





































