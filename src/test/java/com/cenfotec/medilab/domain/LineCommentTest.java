package com.cenfotec.medilab.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.cenfotec.medilab.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class LineCommentTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(LineComment.class);
        LineComment lineComment1 = new LineComment();
        lineComment1.setId(1L);
        LineComment lineComment2 = new LineComment();
        lineComment2.setId(lineComment1.getId());
        assertThat(lineComment1).isEqualTo(lineComment2);
        lineComment2.setId(2L);
        assertThat(lineComment1).isNotEqualTo(lineComment2);
        lineComment1.setId(null);
        assertThat(lineComment1).isNotEqualTo(lineComment2);
    }
}
