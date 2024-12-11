import { registry } from "@web/core/registry";
import { contains, dragenterFiles, dropFiles, inputFiles } from "@web/../tests/utils";

/**
 * This tour depends on data created by python test in charge of launching it.
 * It is not intended to work when launched from interface. It is needed to test
 * an action (action manager) which is not possible to test with QUnit.
 * @see mail/tests/test_mail_composer.py
 */
registry.category("web_tour.tours").add("mail/static/tests/tours/mail_composer_test_tour.js", {
    steps: () => [
        {
            content: "Wait for the chatter to be fully loaded",
            trigger: ".o-mail-Chatter",
            async run() {
                await contains(".o-mail-Message", { count: 1 });
            },
        },
        {
            content: "Click on Send Message",
            trigger: "button:contains(Send message)",
            run: "click",
        },
        {
            content: "Write something in composer",
            trigger: ".o-mail-Composer-input",
            run: "edit blahblah @Not && click body",
        },
        {
            content: "Mention a partner",
            trigger: ".o-mail-Composer-suggestion:contains(Not A Demo User)",
            run: "click",
        },
        {
            content: "Add one file in composer",
            trigger: ".o-mail-Composer button[title='Attach Files']",
            async run() {
                const files = [new File(["hello, world"], "file1.txt", { type: "text/plain" })];
                await inputFiles(".o-mail-Composer .o_input_file", files);
            },
        },
        {
            trigger: ".o-mail-AttachmentCard:not(.o-isUploading)", // waiting the attachment to be uploaded
        },
        {
            content: "Open full composer",
            trigger: "button[title='Open Full Composer']",
            run: "click",
        },
        {
            content: "Check composer keeps open after pushing Escape",
            trigger: ".o_mail_composer_form_view",
            run: "press Escape",
        },
        {
            content: "Check the earlier provided attachment is listed",
            trigger: ".o_field_mail_composer_attachment_list a:contains(file1.txt)",
        },
        {
            content: "Check subject is autofilled",
            trigger: '[name="subject"] input',
            run() {
                const subjectValue = document.querySelector('[name="subject"] input').value;
                if (subjectValue !== "Jane") {
                    console.error(
                        `Full composer should have "Jane" in subject input (actual: ${subjectValue})`
                    );
                }
            },
        },
        {
            content: "Check composer content is kept",
            trigger: '.o_field_html[name="body"]',
            run() {
                const bodyContent = document.querySelector(
                    '.o_field_html[name="body"]'
                ).textContent;
                if (!bodyContent.includes("blahblah @Not A Demo User")) {
                    console.error(
                        `Full composer should contain text from small composer ("blahblah @Not A Demo User") in body input (actual: ${bodyContent})`
                    );
                }
                const mentionLink = document.querySelector(
                    '.o_field_html[name="body"] a'
                ).textContent;
                if (!mentionLink.includes("@Not A Demo User")) {
                    console.error(
                        `Full composer should contain mention link from small composer ("@Not A Demo User") in body input)`
                    );
                }
            },
        },
        {
            content: "Drop a file on the full composer",
            trigger: ".o_mail_composer_form_view",
            async run() {
                const files = [new File(["hi there"], "file2.txt", { type: "text/plain" })];
                await dragenterFiles(".o_mail_composer_form_view .o_form_renderer", files);
                await dropFiles(".o-Dropzone", files);
            }
        },
        {
            content: "Check the attachment is listed",
            trigger: ".o_field_mail_composer_attachment_list a:contains(file2.txt)",
        },
        {
            content: "Click on the mail template selector",
            trigger: ".mail-composer-template-dropdown-btn",
            run: "click",
        },
        {
            content: "Check a template is listed",
            trigger:
                '.mail-composer-template-dropdown.popover .o-dropdown-item:contains("Test template")',
        },
        {
            content: "Send message",
            trigger: ".o_mail_send",
            run: "click",
        },
        {
            content: "Check message is shown",
            trigger: '.o-mail-Message-body:contains("blahblah @Not A Demo User")',
            run: "click",
        },
        {
            content: "Click on envelope to see recipients of message",
            trigger:
                '.o-mail-Message:has(.o-mail-Message-body:contains("blahblah @Not A Demo User")) .o-mail-Message-notification',
            run: "click",
        },
        {
            content: "Check message has correct recipients",
            trigger: ".o-mail-MessageNotificationPopover:contains('Not A Demo User\nJane')",
        },
        {
            content: "Check message contains the first attachment",
            trigger: '.o-mail-Message .o-mail-AttachmentCard:contains("file1.txt")',
        },
        {
            content: "Check message contains the second attachment",
            trigger: '.o-mail-Message .o-mail-AttachmentCard:contains("file2.txt")',
        },
        // Test the full composer input text is kept on closing
        {
            content: "Click on Send Message",
            trigger: "button:contains(Send message)",
            run: "click",
        },
        {
            content: "Open full composer",
            trigger: "button[title='Open Full Composer']",
            run: "click",
        },
        {
            content: "Write something in full composer",
            trigger: ".note-editable",
            run: "editor keep the content",
        },
        {
            content: "Close full composer",
            trigger: ".btn-close",
            run: "click",
        },
        {
            content: "Click on Send Message",
            trigger: "button:contains(Send message)",
            run: "click",
        },
        {
            content: "Check full composer text is kept",
            trigger: ".o-mail-Composer-input",
            run() {
                if (this.anchor.value !== "keep the content") {
                    console.error(
                        "Composer in chatter should contain full composer text after discarding."
                    );
                }
            },
        },
    ],
});
