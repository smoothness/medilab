package com.cenfotec.medilab.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.cenfotec.medilab.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class MedicalExamsTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(MedicalExams.class);
        MedicalExams medicalExams1 = new MedicalExams();
        medicalExams1.setId(1L);
        MedicalExams medicalExams2 = new MedicalExams();
        medicalExams2.setId(medicalExams1.getId());
        assertThat(medicalExams1).isEqualTo(medicalExams2);
        medicalExams2.setId(2L);
        assertThat(medicalExams1).isNotEqualTo(medicalExams2);
        medicalExams1.setId(null);
        assertThat(medicalExams1).isNotEqualTo(medicalExams2);
    }
}
