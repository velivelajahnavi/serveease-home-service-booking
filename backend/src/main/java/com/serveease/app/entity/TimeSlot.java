package com.serveease.app.entity;

import java.time.LocalTime;

public enum TimeSlot {
    MORNING_09_11("09:00 AM - 11:00 AM", LocalTime.of(9, 0)),
    MIDDAY_11_13("11:00 AM - 01:00 PM", LocalTime.of(11, 0)),
    AFTERNOON_14_16("02:00 PM - 04:00 PM", LocalTime.of(14, 0)),
    EVENING_16_18("04:00 PM - 06:00 PM", LocalTime.of(16, 0));

    private final String label;
    private final LocalTime startTime;

    TimeSlot(String label, LocalTime startTime) {
        this.label = label;
        this.startTime = startTime;
    }

    public String getLabel() {
        return label;
    }

    public LocalTime getStartTime() {
        return startTime;
    }
}