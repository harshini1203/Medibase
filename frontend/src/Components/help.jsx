import React from "react";
import {
    HelpContainer,
    HelpTitle,
    FAQAnswer,
    FAQItem,
    FAQQuestion,
    FAQSection,
    FAQTitle,
    HelpDescription,
    SupportLink
} from "./Styles/OtherStyles";
import HomeButton from "./HomeBtn";


function Help() {
  return (
    <>
    <HomeButton />
    <HelpContainer>
      <HelpTitle>Help & Support</HelpTitle>
      <HelpDescription>
        Welcome to the Help Page! Below are answers to common questions about
        using our platform. If you need further assistance, feel free to reach
        out to our support team.
      </HelpDescription>

      <FAQSection>
        <FAQTitle>Frequently Asked Questions (FAQs)</FAQTitle>

        <FAQItem>
          <FAQQuestion>How do I upload files?</FAQQuestion>
          <FAQAnswer>
            Navigate to the <strong>Home</strong> page and click on the{" "}
            <strong>New</strong> button.
          </FAQAnswer>
        </FAQItem>

        <FAQItem>
          <FAQQuestion>How do I view my files?</FAQQuestion>
          <FAQAnswer>
            Navigate to the <strong>View All Files</strong> page to see all your
            uploaded files.
          </FAQAnswer>
        </FAQItem>

        <FAQItem>
          <FAQQuestion>How do I view my categories?</FAQQuestion>
          <FAQAnswer>
            Go to the <strong>Add Categories</strong> page to see all the
            available categories.
          </FAQAnswer>
        </FAQItem>

        <FAQItem>
          <FAQQuestion>How do I delete a file?</FAQQuestion>
          <FAQAnswer>
            Navigate to the <strong>View All Files</strong> page, select the
            file, and click the <strong>Delete</strong> button.
          </FAQAnswer>
        </FAQItem>

        <FAQItem>
          <FAQQuestion>How do I edit a category?</FAQQuestion>
          <FAQAnswer>
            Go to the <strong>Add Categories</strong> page, select the category,
            and click the <strong>Edit</strong> button.
          </FAQAnswer>
        </FAQItem>

        <FAQItem>
          <FAQQuestion>How do I contact support?</FAQQuestion>
          <FAQAnswer>
            You can contact our support team by emailing{" "}
            <SupportLink href="mailto:shamaazath@gmail.com">
              medibasesupport@gmail.com
            </SupportLink>
            .
          </FAQAnswer>
        </FAQItem>
      </FAQSection>
    </HelpContainer>
    </>
  );
}

export default Help;
