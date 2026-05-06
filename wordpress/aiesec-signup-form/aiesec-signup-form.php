<?php
/**
 * Plugin Name: AIESEC OGX Signup Form
 * Description: Embeds the AIESEC OGX signup form via shortcode [aiesec_signup_form].
 * Version: 1.0.0
 */

// Configurable cache TTL (seconds). Override in wp-config.php if needed.
if (!defined('AIESEC_ALIGNMENTS_CACHE_TTL')) {
    define('AIESEC_ALIGNMENTS_CACHE_TTL', HOUR_IN_SECONDS);
}

function aiesec_signup_form_enqueue($program) {
    $plugin_url = plugin_dir_url(__FILE__);
    $assets_dir = plugin_dir_path(__FILE__) . 'assets/';

    $css_files = glob($assets_dir . 'index-*.css');
    $js_files  = glob($assets_dir . 'index-*.js');

    if (!empty($css_files)) {
        wp_enqueue_style('aiesec-signup-form', $plugin_url . 'assets/' . basename($css_files[0]), [], null);
    }
    if (!empty($js_files)) {
        wp_enqueue_script('aiesec-signup-form', $plugin_url . 'assets/' . basename($js_files[0]), [], null, true);
    }

    // Fetch (and cache) MC Alignments for Mexico
    $transient_key   = 'aiesec_mc_alignments_mexico';
    $alignments_data = get_transient($transient_key);

    if ($alignments_data === false) {
        $alignments_url = getenv('AIESEC_ALIGNMENTS_URL');
        if ($alignments_url === false) {
            wp_die('AIESEC_ALIGNMENTS_URL environment variable is not defined.');
        }
        $response = wp_remote_get($alignments_url);
        if (!is_wp_error($response)) {
            $body = wp_remote_retrieve_body($response);
            if (json_validate($body)) {
                $alignments_data = $body;
                set_transient($transient_key, $alignments_data, AIESEC_ALIGNMENTS_CACHE_TTL);
            }
        }
    }

    $inline = 'window.AIESEC_PROGRAM = ' . json_encode($program) . ';';
    if ($alignments_data !== false) {
        $inline .= "\nwindow.AIESEC_MC_ALIGNMENTS = " . $alignments_data . ';';
    }
    wp_add_inline_script('aiesec-signup-form', $inline, 'before');
}

function aiesec_signup_form_shortcode($atts) {
    $atts = shortcode_atts(['program' => ''], $atts, 'aiesec_signup_form');
    $valid_programs = ['GV', 'GTa', 'GTe'];
    if (!in_array($atts['program'], $valid_programs, true)) {
        return '<!-- [aiesec_signup_form] error: invalid or missing "program" attribute (expected: GV, GTa, or GTe) -->';
    }
    aiesec_signup_form_enqueue($atts['program']);
    return '<div id="aiesec-signup-form"></div>';
}
add_shortcode('aiesec_signup_form', 'aiesec_signup_form_shortcode');
