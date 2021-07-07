package com.cenfotec.medilab.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.cenfotec.medilab.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class BinnacleTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Binnacle.class);
        Binnacle binnacle1 = new Binnacle();
        binnacle1.setId(1L);
        Binnacle binnacle2 = new Binnacle();
        binnacle2.setId(binnacle1.getId());
        assertThat(binnacle1).isEqualTo(binnacle2);
        binnacle2.setId(2L);
        assertThat(binnacle1).isNotEqualTo(binnacle2);
        binnacle1.setId(null);
        assertThat(binnacle1).isNotEqualTo(binnacle2);
    }
}
