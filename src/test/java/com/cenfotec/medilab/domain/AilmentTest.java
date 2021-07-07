package com.cenfotec.medilab.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.cenfotec.medilab.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class AilmentTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Ailment.class);
        Ailment ailment1 = new Ailment();
        ailment1.setId(1L);
        Ailment ailment2 = new Ailment();
        ailment2.setId(ailment1.getId());
        assertThat(ailment1).isEqualTo(ailment2);
        ailment2.setId(2L);
        assertThat(ailment1).isNotEqualTo(ailment2);
        ailment1.setId(null);
        assertThat(ailment1).isNotEqualTo(ailment2);
    }
}
