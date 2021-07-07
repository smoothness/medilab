package com.cenfotec.medilab.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.cenfotec.medilab.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class EmergencyContactTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(EmergencyContact.class);
        EmergencyContact emergencyContact1 = new EmergencyContact();
        emergencyContact1.setId(1L);
        EmergencyContact emergencyContact2 = new EmergencyContact();
        emergencyContact2.setId(emergencyContact1.getId());
        assertThat(emergencyContact1).isEqualTo(emergencyContact2);
        emergencyContact2.setId(2L);
        assertThat(emergencyContact1).isNotEqualTo(emergencyContact2);
        emergencyContact1.setId(null);
        assertThat(emergencyContact1).isNotEqualTo(emergencyContact2);
    }
}
