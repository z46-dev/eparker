#version 300 es
precision lowp float;

in vec2 v_uv;
uniform vec2 u_resolution;
uniform float u_time;
out vec4 fragColor;

// Constants (Precomputed values for performance)
const float COL_SCALE_1 = 0.5f;
const float COL_SCALE_2 = 0.2f;
const float DETAIL_LEVEL = 2.7f;
const float BROWNIAN_SCALE = 0.5828f;
const int OCTAVES = 6;
const vec2 ADDITIVE = vec2(12.9898f, 78.233f);
const vec2 SHIFT = vec2(100.0f);
const vec3 DEEP_WATER = vec3(0.0f, 0.4f, 0.6f);
const vec3 SHALLOW_WATER = vec3(0.0f, 0.6f, 0.85f);
const vec3 WAVE_CAPS = vec3(1.0f, 1.0f, 1.0f);
const mat2 ROT = mat2(cos(0.5f), sin(0.5f), -sin(0.5f), cos(0.5f));

float random(vec2 point) {
    return fract(sin(dot(point, ADDITIVE)) * 43758.5453123f);
}

// Noise function
float noise(vec2 point) {

    vec2 floorPoint = floor(point);
    vec2 fraction = fract(point);
    float a = random(floorPoint);
    float b = random(floorPoint + vec2(1.0f, 0.0f));
    float c = random(floorPoint + vec2(0.0f, 1.0f));
    float d = random(floorPoint + vec2(1.0f, 1.0f));
    vec2 smoothed = fraction * fraction * (3.0f - 2.0f * fraction);
    return mix(mix(a, b, smoothed.x), mix(c, d, smoothed.x), smoothed.y);
}

// Fractional Brownian Motion
float fbm(vec2 point) {
    float value = 0.0f;
    float amplitude = BROWNIAN_SCALE;

    for(int i = 0; i < OCTAVES; i++) {
        value += amplitude * noise(point);
        point = ROT * point * DETAIL_LEVEL + SHIFT;
        amplitude *= BROWNIAN_SCALE;
    }

    return value * COL_SCALE_2 + COL_SCALE_1;
}

void main() {
    float time = u_time * 0.00024414f;
    vec2 center = vec2(0.5f, 0.5f), point = v_uv;
    vec3 transform = vec3(time * .002f, sin(time * .003f), 2.0f + sin(time * .004f));

    if(u_resolution.x > u_resolution.y) {
        float aspectRatio = u_resolution.x / u_resolution.y;
        point.x *= aspectRatio;
        center.x *= aspectRatio;
        transform.x *= aspectRatio;
    } else {
        float aspectRatio = u_resolution.y / u_resolution.x;
        point.y *= aspectRatio;
        center.y *= aspectRatio;
        transform.y *= aspectRatio;
    }

    point = (point - center) * transform.z + center + transform.xy / u_resolution;

    vec2 position = vec2(fbm(point), fbm(point + vec2(1.0f)));
    vec2 offset = vec2(fbm(point + position + vec2(1.7f, 9.2f) + time)) * 1.5f;
    offset += fbm(point + offset + vec2(1.0f, 0.0f) + time) * 0.5f;

    float f = fbm(point + offset);
    vec3 color = mix(DEEP_WATER, SHALLOW_WATER, clamp(f * f * 4.0f, 0.0f, 1.0f));
    color = mix(color, SHALLOW_WATER, clamp(length(offset.x), 0.0f, 1.0f) * 0.6f);
    color = mix(color, WAVE_CAPS, clamp(length(position), 0.0f, 1.0f) * 0.4f);

    float waveCapValue = fbm(point + offset) * (0.5f + 0.5f * sin(time * 0.5f)) * (0.5f + 0.5f * sin(time * 0.1f + fbm(point * offset) + point.x * point.y));
    if(waveCapValue > COL_SCALE_1 + COL_SCALE_2) {
        color = mix(color, WAVE_CAPS, clamp((waveCapValue - (COL_SCALE_1 + COL_SCALE_2)) * 100.0f, 0.0f, 1.0f));
    }

    fragColor = vec4((f * f * f + 0.6f * f * f + 0.5f * f) * color, 1.0f);
}
