package com.cenfotec.medilab.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.cenfotec.medilab.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class AppointmentTreatmentAilmentTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(AppointmentTreatmentAilment.class);
        AppointmentTreatmentAilment appointmentTreatmentAilment1 = new AppointmentTreatmentAilment();
        appointmentTreatmentAilment1.setId(1L);
        AppointmentTreatmentAilment appointmentTreatmentAilment2 = new AppointmentTreatmentAilment();
        appointmentTreatmentAilment2.setId(appointmentTreatmentAilment1.getId());
        assertThat(appointmentTreatmentAilment1).isEqualTo(appointmentTreatmentAilment2);
        appointmentTreatmentAilment2.setId(2L);
        assertThat(appointmentTreatmentAilment1).isNotEqualTo(appointmentTreatmentAilment2);
        appointmentTreatmentAilment1.setId(null);
        assertThat(appointmentTreatmentAilment1).isNotEqualTo(appointmentTreatmentAilment2);
    }
}
