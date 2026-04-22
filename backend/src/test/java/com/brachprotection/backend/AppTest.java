package com.brachprotection.backend;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

class AppTest {
    @Test
    void healthShouldReportOk() {
        assertEquals("ok", App.health());
    }
}