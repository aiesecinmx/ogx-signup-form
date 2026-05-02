<?php
/**
 * Plugin Name: AIESEC OGX Signup Form
 * Description: Embeds the AIESEC OGX signup form via shortcode [aiesec_signup_form].
 * Version: 1.0.0
 */

function aiesec_signup_form_enqueue() {
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
}

function aiesec_signup_form_shortcode() {
    aiesec_signup_form_enqueue();
    return '<div id="aiesec-signup-form"></div>';
}
add_shortcode('aiesec_signup_form', 'aiesec_signup_form_shortcode');
