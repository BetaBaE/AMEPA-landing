// Rendu GPU d'une colonne d'eau dans un tube de verre. Dessine une image à la demande.
const VERT = 'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}'

const FRAG = `precision highp float;
uniform vec2 r,g,gs;uniform float a,b,f,e,h,d,k;
float hash(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}
float noise(vec2 p){vec2 i=floor(p),u=fract(p);u=u*u*(3.-2.*u);return mix(mix(hash(i),hash(i+vec2(1,0)),u.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),u.x),u.y);}
float fbm(vec2 p){return .55*noise(p)+.3*noise(p*2.1+7.3)+.15*noise(p*4.3+3.1);}
float capsule(vec2 p,float y0,float y1,float w){vec2 q=abs(p-vec2(0.,(y0+y1)*.5))-vec2(w,max(w,(y1-y0)*.5))+w;return length(max(q,0.))+min(max(q.x,q.y),0.)-w;}
// Union douce : deux masses d'eau qui se rapprochent fusionnent par un pont de liquide.
float smin(float a,float b,float k){float t=clamp(.5+.5*(b-a)/k,0.,1.);return mix(b,a,t)-k*t*(1.-t);}
void main(){
  vec2 p=vec2(gl_FragCoord.x-r.x*.5,r.y-gl_FragCoord.y);
  float y=p.y/d;
  float w=d*mix(3.5,5.,h)*k;
  float tw=d*mix(3.5,6.25,h);
  // Tube de verre : à peine visible au repos, net au survol.
  float td=capsule(p,d*6.,r.y-d*6.,tw);
  float tube=smoothstep(.7,-.7,td);
  float tn=p.x/tw;
  float glass=mix(.16,.34,h)+.16*h*pow(abs(tn),3.);
  vec3 gcol=mix(vec3(.45,.56,.67),vec3(.62,.72,.82),pow(abs(tn),2.));
  vec4 o=vec4(gcol,1.)*tube*glass;
  // Colonne d'eau : parois qui ondulent avec la vitesse.
  float sway=sin(y*.085-f*.06)+.6*sin(y*.19+f*.09+1.7);
  float sd=capsule(p,a,b,w)+e*d*.45*sway*smoothstep(0.,d*18.,min(p.y-a,b-p.y));
  // Gouttes qui traînent derrière la colonne, se détachent quand on défile vite, puis rejoignent la masse.
  float kk=w*1.15;
  sd=smin(sd,length(p-vec2(0.,g.x))-w*gs.x,kk);
  sd=smin(sd,length(p-vec2(0.,g.y))-w*gs.y,kk);
  float m=smoothstep(.75,-.75,sd);
  float n=clamp(p.x/w,-1.,1.);
  float z=sqrt(max(0.,1.-n*n));
  float t=clamp((p.y-a)/max(1.,b-a),0.,1.);
  // Courant : bruit étiré dans le sens de l'écoulement, déformé, entraîné par f.
  vec2 q=vec2(n*1.1,(y-f)*.022);
  q.x+=.9*(fbm(q*1.3+vec2(0.,f*.004))-.5);
  float c=fbm(vec2(q.x*2.2,q.y*2.));
  float vein=pow(1.-abs(2.*fbm(vec2(q.x*2.6+4.,q.y*3.2))-1.),5.);
  vec3 deep=vec3(.030,.330,.560),mid=vec3(.055,.486,.761),aqua=vec3(.18,.77,.71);
  vec3 col=mix(mid,aqua,clamp(t*.42+(c-.5)*(.35+.9*e),0.,1.));
  col=mix(deep,col,.35+.65*z);
  col+=vein*mix(.03,.20,e)*z*vec3(.75,1.,.98);
  // Bulles d'air entraînées par le courant, visibles quand l'eau bouge.
  float bx=p.x/d,cell=floor((y-f*.9)/15.);
  float bb=0.;
  for(int i=-1;i<=1;i++){
    float ci=cell+float(i);
    float on=step(.55,hash(vec2(ci,1.7)));
    float br=mix(.6,1.5,hash(vec2(ci,9.1)))*k;
    vec2 bc=vec2((hash(vec2(ci,4.3))-.5)*w/d*1.1,(ci+.3+.4*hash(vec2(ci,6.2)))*15.+f*.9);
    float bd=length(vec2(bx,y)-bc)-br;
    bb+=on*(smoothstep(.55,0.,abs(bd))*.7+smoothstep(0.,-br,bd)*.18);
  }
  col+=bb*smoothstep(.04,.5,e)*vec3(.85,1.,1.)*.75;
  col+=exp(-pow((n+.46)*4.2,2.))*.15;
  col+=exp(-pow((n-.62)*6.,2.))*.08;
  col+=smoothstep(d*2.6,0.,abs(sd+d*.9))*smoothstep(d*9.,0.,min(abs(p.y-a),abs(b-p.y)))*.11;
  o=vec4(col,1.)*m+o*(1.-m);
  // Reflet du verre, au survol.
  o.rgb+=tube*h*exp(-pow((tn+.66)*7.,2.))*.20*(o.a);
  gl_FragColor=o;
}`

export function createLiquid(canvas) {
  const gl = canvas.getContext('webgl', { alpha: true, premultipliedAlpha: true, antialias: false, powerPreference: 'low-power' })
  if (!gl) return null
  const shader = (type, src) => {
    const s = gl.createShader(type)
    gl.shaderSource(s, src)
    gl.compileShader(s)
    return s
  }
  const prog = gl.createProgram()
  gl.attachShader(prog, shader(gl.VERTEX_SHADER, VERT))
  gl.attachShader(prog, shader(gl.FRAGMENT_SHADER, FRAG))
  gl.linkProgram(prog)
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return null
  gl.useProgram(prog)
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer())
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
  const loc = gl.getAttribLocation(prog, 'p')
  gl.enableVertexAttribArray(loc)
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0)
  const u = Object.fromEntries(['r', 'a', 'b', 'f', 'e', 'h', 'd', 'k', 'g', 'gs'].map((n) => [n, gl.getUniformLocation(prog, n)]))
  return {
    draw(s) {
      if (gl.isContextLost()) return
      const d = Math.min(2, window.devicePixelRatio || 1)
      const w = Math.round(canvas.clientWidth * d)
      const h = Math.round(canvas.clientHeight * d)
      if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h }
      gl.viewport(0, 0, w, h)
      gl.uniform2f(u.r, w, h)
      gl.uniform1f(u.a, s.top * d)
      gl.uniform1f(u.b, s.bottom * d)
      gl.uniform1f(u.f, s.flow)
      gl.uniform1f(u.e, s.energy)
      gl.uniform1f(u.h, s.hover)
      gl.uniform1f(u.k, s.thin)
      gl.uniform1f(u.d, d)
      gl.uniform2f(u.g, s.drops[0] * d, s.drops[1] * d)
      gl.uniform2f(u.gs, s.dropSize[0], s.dropSize[1])
      gl.drawArrays(gl.TRIANGLES, 0, 3)
    },
  }
}
