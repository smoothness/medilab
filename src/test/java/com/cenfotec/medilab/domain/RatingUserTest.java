package com.cenfotec.medilab.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.cenfotec.medilab.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class RatingUserTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(RatingUser.class);
        RatingUser ratingUser1 = new RatingUser();
        ratingUser1.setId(1L);
        RatingUser ratingUser2 = new RatingUser();
        ratingUser2.setId(ratingUser1.getId());
        assertThat(ratingUser1).isEqualTo(ratingUser2);
        ratingUser2.setId(2L);
        assertThat(ratingUser1).isNotEqualTo(ratingUser2);
        ratingUser1.setId(null);
        assertThat(ratingUser1).isNotEqualTo(ratingUser2);
    }
}
