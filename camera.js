//fov为度数，fovScale预乘以2，因为sx(0,1)映射到(-1,1)要乘以2
perspectiveCamera = function(eye,front,up,fov){
    this.eye   = eye;
    this.front = front;
    this.refUp = up;
    this.fov   = fov;
};

perspectiveCamera.prototype = {
    initialize:
        function(){
            this.right = this.front.cross(this.refUp);
            this.up    = this.right.cross(this.front);
            this.fovScale = Math.tan(this.fov*0.5*Math.PI/180)*2;
        },
    generateRay:
        function(x,y){
            var r = this.right.multiply((x-0.5)*this.fovScale);
            var u = this.up.multiply((y - 0.5) * this.fovScale);
            return new ray3(this.eye,this.front.add(r).add(u).normalize());
        }
};