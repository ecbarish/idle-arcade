// The faded world (Wildbond's premise): everything is washed out, except where bonds have brought colour back.
// Each restore point is a circle (x, y, radius in screen pixels, unused) where full colour shows through.
shader_type canvas_item;
uniform sampler2D screen_tex : hint_screen_texture, filter_nearest;
uniform vec4 points[8];
uniform int count = 0;
uniform float fade = 0.78; // how washed out the faded world is (0 = full colour, 1 = grey)
void fragment() {
	vec4 c = texture(screen_tex, SCREEN_UV);
	vec2 px = SCREEN_UV / SCREEN_PIXEL_SIZE;
	float restored = 0.0;
	for (int i = 0; i < 8; i++) {
		if (i >= count) break;
		float d = distance(px, points[i].xy);
		float r = points[i].z;
		restored = max(restored, 1.0 - smoothstep(r * 0.8, r, d));
	}
	float g = dot(c.rgb, vec3(0.299, 0.587, 0.114));
	vec3 faded = mix(c.rgb, vec3(g) * vec3(1.03, 1.0, 0.92), fade); // grey with a faint old-photo warmth
	COLOR = vec4(mix(faded, c.rgb, restored), 1.0);
}
