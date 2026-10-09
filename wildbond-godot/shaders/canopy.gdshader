// Tree tops drawn in front of you (depth, WB2.2). You stand on the colour layer above the faded world, so anything
// that passes in front of you is drawn up here too, washed out by the same rule as fade.gdshader (same restore points).
shader_type canvas_item;
uniform vec4 points[8];
uniform int count = 0;
uniform float fade = 0.78;
void fragment() {
	vec4 c = COLOR;
	vec2 px = SCREEN_UV / SCREEN_PIXEL_SIZE;
	float restored = 0.0;
	for (int i = 0; i < 8; i++) {
		if (i >= count) break;
		float d = distance(px, points[i].xy);
		float r = points[i].z;
		restored = max(restored, 1.0 - smoothstep(r * 0.8, r, d));
	}
	float g = dot(c.rgb, vec3(0.299, 0.587, 0.114));
	vec3 faded = mix(c.rgb, vec3(g) * vec3(1.03, 1.0, 0.92), fade);
	COLOR = vec4(mix(faded, c.rgb, restored), c.a);
}
