import { generateMetadata } from "lib/metadata"
import Link from "next/link"

export const metadata = generateMetadata({
  title: "Privacy Policy",
})

export default function Page() {
  return (
    <main className="flex flex-col items-center justify-center w-full px-4 pt-16 pb-20 bg-primary-darker lg:pt-24">
      <div className="flex flex-col w-full max-w-4xl">
        <h1 className="text-4xl font-bold">Privacy Policy</h1>
        <p className="mb-8">Last updated: July 01, 2024</p>

        <p>
          This privacy notice for ADAM Digital Sdn. Bhd. (&quot;we,&quot;
          &quot;us,&quot; or &quot;our&quot;), describes how and why we might
          collect, store, use, and/or share (&quot;process&quot;) your
          information when you use our services (&quot;Services&quot;), such as
          when you:
        </p>
        <ul className="pl-5 list-disc">
          <li>
            Visit our website at&nbsp;
            <Link
              href="/"
              className="transition text-blue-dim hover:text-blue-dim/80"
            >
              https://www.esauniverse.com
            </Link>
            , or any website of ours that links to this privacy notice
          </li>
          <li>
            Download and use our mobile application (ESA - Electronic Solat
            App), or any other application of ours that links to this privacy
            notice
          </li>
          <li>
            Engage with us in other related ways, including any sales,
            marketing, or events
          </li>
        </ul>

        <p className="mt-4">
          Questions or concerns? Reading this privacy notice will help you
          understand your privacy rights and choices. If you do not agree with
          our policies and practices, please do not use our Services. If you
          still have any questions or concerns, please contact us at&nbsp;
          <a
            href="mailto:admin@adamda.com"
            className="text-blue-500"
          >
            admin@adamda.com
          </a>
          .
        </p>

        <h2 className="mt-6 text-2xl font-bold">SUMMARY OF KEY POINTS</h2>
        <p>
          This summary provides key points from our privacy notice, but you can
          find out more details about any of these topics by clicking the link
          following each key point or by using our table of contents below to
          find the section you are looking for.
        </p>

        <ul className="pl-5 list-disc">
          <li>
            What personal information do we process? When you visit, use, or
            navigate our Services, we may process personal information depending
            on how you interact with us and the Services, the choices you make,
            and the products and features you use.{" "}
            <a
              href="#1"
              className="text-blue-500"
            >
              Learn more about personal information you disclose to us.
            </a>
          </li>
          <li>
            Do we process any sensitive personal information? We do not process
            sensitive personal information.
          </li>
          <li>
            Do we collect any information from third parties? We do not collect
            any information from third parties.
          </li>
          <li>
            How do we process your information? We process your information to
            provide, improve, and administer our Services, communicate with you,
            for security and fraud prevention, and to comply with law. We may
            also process your information for other purposes with your consent.
            We process your information only when we have a valid legal reason
            to do so.{" "}
            <a
              href="#2"
              className="text-blue-500"
            >
              Learn more about how we process your information.
            </a>
          </li>
          <li>
            In what situations and with which parties do we share personal
            information? We may share information in specific situations and
            with specific third parties.{" "}
            <a
              href="#3"
              className="text-blue-500"
            >
              Learn more about when and with whom we share your personal
              information.
            </a>
          </li>
          <li>
            How do we keep your information safe? We have organizational and
            technical processes and procedures in place to protect your personal
            information. However, no electronic transmission over the internet
            or information storage technology can be guaranteed to be 100%
            secure, so we cannot promise or guarantee that hackers,
            cybercriminals, or other unauthorized third parties will not be able
            to defeat our security and improperly collect, access, steal, or
            modify your information.{" "}
            <a
              href="#7"
              className="text-blue-500"
            >
              Learn more about how we keep your information safe.
            </a>
          </li>
          <li>
            What are your rights? Depending on where you are located
            geographically, the applicable privacy law may mean you have certain
            rights regarding your personal information.{" "}
            <a
              href="#9"
              className="text-blue-500"
            >
              Learn more about your privacy rights.
            </a>
          </li>
          <li>
            How do you exercise your rights? The easiest way to exercise your
            rights is by submitting a data subject access request, or by
            contacting us. We will consider and act upon any request in
            accordance with applicable data protection laws.
          </li>
        </ul>

        <h2 className="mt-6 text-2xl font-bold">TABLE OF CONTENTS</h2>
        <ul className="pl-5 list-decimal">
          <li>
            <a
              href="#1"
              className="text-blue-500"
            >
              WHAT INFORMATION DO WE COLLECT?
            </a>
          </li>
          <li>
            <a
              href="#2"
              className="text-blue-500"
            >
              HOW DO WE PROCESS YOUR INFORMATION?
            </a>
          </li>
          <li>
            <a
              href="#3"
              className="text-blue-500"
            >
              WHEN AND WITH WHOM DO WE SHARE YOUR PERSONAL INFORMATION?
            </a>
          </li>
          <li>
            <a
              href="#4"
              className="text-blue-500"
            >
              WHAT IS OUR STANCE ON THIRD-PARTY WEBSITES?
            </a>
          </li>
          <li>
            <a
              href="#5"
              className="text-blue-500"
            >
              DO WE USE COOKIES AND OTHER TRACKING TECHNOLOGIES?
            </a>
          </li>
          <li>
            <a
              href="#6"
              className="text-blue-500"
            >
              HOW LONG DO WE KEEP YOUR INFORMATION?
            </a>
          </li>
          <li>
            <a
              href="#7"
              className="text-blue-500"
            >
              HOW DO WE KEEP YOUR INFORMATION SAFE?
            </a>
          </li>
          <li>
            <a
              href="#8"
              className="text-blue-500"
            >
              DO WE COLLECT INFORMATION FROM MINORS?
            </a>
          </li>
          <li>
            <a
              href="#9"
              className="text-blue-500"
            >
              WHAT ARE YOUR PRIVACY RIGHTS?
            </a>
          </li>
          <li>
            <a
              href="#10"
              className="text-blue-500"
            >
              CONTROLS FOR DO-NOT-TRACK FEATURES
            </a>
          </li>
          <li>
            <a
              href="#11"
              className="text-blue-500"
            >
              DO WE MAKE UPDATES TO THIS NOTICE?
            </a>
          </li>
          <li>
            <a
              href="#12"
              className="text-blue-500"
            >
              HOW CAN YOU CONTACT US ABOUT THIS NOTICE?
            </a>
          </li>
          <li>
            <a
              href="#13"
              className="text-blue-500"
            >
              HOW CAN YOU REVIEW, UPDATE, OR DELETE THE DATA WE COLLECT FROM
              YOU?
            </a>
          </li>
        </ul>

        <h2
          className="mt-6 text-2xl font-bold"
          id="1"
        >
          1. WHAT INFORMATION DO WE COLLECT?
        </h2>
        <h3 className="mt-4 text-xl font-bold">
          Personal information you disclose to us
        </h3>
        <p>
          <strong>In Short:</strong> We collect personal information that you
          provide to us.
        </p>
        <p>
          We collect personal information that you voluntarily provide to us
          when you express an interest in obtaining information about us or our
          products and Services, when you participate in activities on the
          Services, or otherwise when you contact us.
        </p>

        <h4 className="mt-4 text-lg font-bold">
          Personal Information Provided by You.
        </h4>
        <p>
          The personal information that we collect depends on the context of
          your interactions with us and the Services, the choices you make, and
          the products and features you use. The personal information we collect
          may include the following:
        </p>
        <ul className="pl-5 list-disc">
          <li>names</li>
          <li>phone numbers</li>
          <li>email addresses</li>
        </ul>

        <h4 className="mt-4 text-lg font-bold">Sensitive Information.</h4>
        <p>We do not process sensitive information.</p>

        <h4 className="mt-4 text-lg font-bold">Payment Data.</h4>
        <p>
          We may collect data necessary to process your payment if you choose to
          make purchases, such as your payment instrument number, and the
          security code associated with your payment instrument. All payment
          data is handled and stored by PayHalal. You may find their privacy
          notice link(s) here:{" "}
          <a
            href="https://payhalal.my/files/PrivacyPolicy/PrivacyPolicy.pdf"
            className="text-blue-500"
          >
            https://payhalal.my/files/PrivacyPolicy/PrivacyPolicy.pdf
          </a>
          .
        </p>

        <h4 className="mt-4 text-lg font-bold">Application Data.</h4>
        <p>
          If you use our application(s), we also may collect the following
          information if you choose to provide us with access or permission:
        </p>
        <ul className="pl-5 list-disc">
          <li>
            <strong>Geolocation Information.</strong> We may request access or
            permission to track location-based information from your mobile
            device, either continuously or while you are using our mobile
            application(s), to provide certain location-based services. If you
            wish to change our access or permissions, you may do so in your
            device&apos;s settings.
          </li>
          <li>
            <strong>Mobile Device Access.</strong> We may request access or
            permission to certain features from your mobile device, including
            your mobile device&apos;s contacts, calendar, reminders, and other
            features. If you wish to change our access or permissions, you may
            do so in your device&apos;s settings.
          </li>
          <li>
            <strong>Mobile Device Data.</strong> We may automatically collect
            device information (such as your mobile device ID, model and
            manufacturer), operating system, version information, and system
            configuration information, device and application identification
            numbers, browser type and version, hardware model, Internet service
            provider, and/or mobile carrier, and Internet Protocol (IP) address
            (or proxy server).
          </li>
        </ul>

        <p>
          This information is primarily needed to maintain the security and
          operation of our application(s), for troubleshooting, and for our
          internal analytics and reporting purposes.
        </p>

        <h4 className="mt-4 text-lg font-bold">Push Notifications.</h4>
        <p>
          We may request to send you push notifications regarding your account
          or certain features of the application(s). If you wish to opt-out from
          receiving these types of communications, you may turn them off in your
          device&apos;s settings.
        </p>

        <p className="mt-4">
          All personal information that you provide to us must be true,
          complete, and accurate, and you must notify us of any changes to such
          personal information.
        </p>

        <h2
          className="mt-6 text-2xl font-bold"
          id="2"
        >
          2. HOW DO WE PROCESS YOUR INFORMATION?
        </h2>
        <p>
          <strong>In Short:</strong> We process your information to provide,
          improve, and administer our Services, communicate with you, for
          security and fraud prevention, and to comply with law. We may also
          process your information for other purposes with your consent.
        </p>

        <p>
          We process your personal information for a variety of reasons,
          depending on how you interact with our Services, including:
        </p>
        <ul className="pl-5 list-disc">
          <li>
            <strong>
              To facilitate account creation and authentication and otherwise
              manage user accounts.
            </strong>{" "}
            We may process your information so you can create and log in to your
            account, as well as keep your account in working order.
          </li>
          <li>
            <strong>
              To deliver and facilitate delivery of services to the user.
            </strong>{" "}
            We may process your information to provide you with the requested
            service.
          </li>
          <li>
            <strong>To send administrative information to you.</strong> We may
            process your information to send you details about our products and
            services, changes to our terms and policies, and other similar
            information.
          </li>
          <li>
            <strong>To fulfill and manage your orders.</strong> We may process
            your information to fulfill and manage your orders, payments,
            returns, and exchanges made through the Services.
          </li>
          <li>
            <strong>To request feedback.</strong> We may process your
            information when necessary to request feedback and to contact you
            about your use of our Services.
          </li>
          <li>
            <strong>
              To send you marketing and promotional communications.
            </strong>{" "}
            We may process the personal information you send to us for our
            marketing purposes, if this is in accordance with your marketing
            preferences. You can opt-out of our marketing emails at any time.
            For more information, see &quot;WHAT ARE YOUR PRIVACY RIGHTS?&quot;
            below.
          </li>
          <li>
            <strong>To deliver targeted advertising to you.</strong> We may
            process your information to develop and display personalized content
            and advertising tailored to your interests, location, and more.
          </li>
          <li>
            <strong>To protect our Services.</strong> We may process your
            information as part of our efforts to keep our Services safe and
            secure, including fraud monitoring and prevention.
          </li>
          <li>
            <strong>To identify usage trends.</strong> We may process
            information about how you use our Services to better understand how
            they are being used so we can improve them.
          </li>
          <li>
            <strong>
              To determine the effectiveness of our marketing and promotional
              campaigns.
            </strong>{" "}
            We may process your information to better understand how to provide
            marketing and promotional campaigns that are most relevant to you.
          </li>
          <li>
            <strong>To comply with our legal obligations.</strong> We may
            process your information to comply with our legal obligations,
            respond to legal requests, and prevent harm.
          </li>
        </ul>

        <h2
          className="mt-6 text-2xl font-bold"
          id="3"
        >
          3. WHEN AND WITH WHOM DO WE SHARE YOUR PERSONAL INFORMATION?
        </h2>
        <p>
          <strong>In Short:</strong> We may share information in specific
          situations described in this section and/or with the following third
          parties.
        </p>
        <p>
          We may need to share your personal information in the following
          situations:
        </p>
        <ul className="pl-5 list-disc">
          <li>
            <strong>Business Transfers.</strong> We may share or transfer your
            information in connection with, or during negotiations of, any
            merger, sale of company assets, financing, or acquisition of all or
            a portion of our business to another company.
          </li>
          <li>
            <strong>Affiliates.</strong> We may share your information with our
            affiliates, in which case we will require those affiliates to honor
            this privacy notice. Affiliates include our parent company and any
            subsidiaries, joint venture partners, or other companies that we
            control or that are under common control with us.
          </li>
          <li>
            <strong>Business Partners.</strong> We may share your information
            with our business partners to offer you certain products, services,
            or promotions.
          </li>
        </ul>

        <h2
          className="mt-6 text-2xl font-bold"
          id="4"
        >
          4. WHAT IS OUR STANCE ON THIRD-PARTY WEBSITES?
        </h2>
        <p>
          <strong>In Short:</strong> We are not responsible for the safety of
          any information that you share with third-party providers who
          advertise, but are not affiliated with, our Services.
        </p>
        <p>
          The Services may link to third-party websites, online services, or
          mobile applications and/or contain advertisements from third parties
          that are not affiliated with us and which may link to other websites,
          services, or applications. Accordingly, we do not make any guarantee
          regarding any such third parties, and we will not be liable for any
          loss or damage caused by the use of such third-party websites,
          services, or applications. The inclusion of a link towards a
          third-party website, service, or application does not imply an
          endorsement by us. We cannot guarantee the safety and privacy of data
          you provide to any third parties. Any data collected by third parties
          is not covered by this privacy notice. We are not responsible for the
          content or privacy and security practices and policies of any third
          parties, including other websites, services, or applications that may
          be linked to or from the Services. You should review the policies of
          such third parties and contact them directly to respond to your
          questions.
        </p>

        <h2
          className="mt-6 text-2xl font-bold"
          id="5"
        >
          5. DO WE USE COOKIES AND OTHER TRACKING TECHNOLOGIES?
        </h2>
        <p>
          <strong>In Short:</strong> We may use cookies and other tracking
          technologies to collect and store your information.
        </p>
        <p>
          We may use cookies and similar tracking technologies (like web beacons
          and pixels) to access or store information. Specific information about
          how we use such technologies and how you can refuse certain cookies is
          set out in our Cookie Notice.
        </p>

        <h2
          className="mt-6 text-2xl font-bold"
          id="6"
        >
          6. HOW LONG DO WE KEEP YOUR INFORMATION?
        </h2>
        <p>
          <strong>In Short:</strong> We keep your information for as long as
          necessary to fulfill the purposes outlined in this privacy notice
          unless otherwise required by law.
        </p>
        <p>
          We will only keep your personal information for as long as it is
          necessary for the purposes set out in this privacy notice, unless a
          longer retention period is required or permitted by law (such as tax,
          accounting, or other legal requirements). No purpose in this notice
          will require us keeping your personal information for longer than the
          period of time in which users have an account with us.
        </p>
        <p>
          When we have no ongoing legitimate business need to process your
          personal information, we will either delete or anonymize such
          information, or, if this is not possible (for example, because your
          personal information has been stored in backup archives), then we will
          securely store your personal information and isolate it from any
          further processing until deletion is possible.
        </p>

        <h2
          className="mt-6 text-2xl font-bold"
          id="7"
        >
          7. HOW DO WE KEEP YOUR INFORMATION SAFE?
        </h2>
        <p>
          <strong>In Short:</strong> We aim to protect your personal information
          through a system of organizational and technical security measures.
        </p>
        <p>
          We have implemented appropriate and reasonable technical and
          organizational security measures designed to protect the security of
          any personal information we process. However, despite our safeguards
          and efforts to secure your information, no electronic transmission
          over the Internet or information storage technology can be guaranteed
          to be 100% secure, so we cannot promise or guarantee that hackers,
          cybercriminals, or other unauthorized third parties will not be able
          to defeat our security and improperly collect, access, steal, or
          modify your information. Although we will do our best to protect your
          personal information, transmission of personal information to and from
          our Services is at your own risk. You should only access the Services
          within a secure environment.
        </p>

        <h2
          className="mt-6 text-2xl font-bold"
          id="8"
        >
          8. DO WE COLLECT INFORMATION FROM MINORS?
        </h2>
        <p>
          <strong>In Short:</strong> We do not knowingly collect data from or
          market to children under 18 years of age.
        </p>
        <p>
          We do not knowingly solicit data from or market to children under 18
          years of age. By using the Services, you represent that you are at
          least 18 or that you are the parent or guardian of such a minor and
          consent to such minor dependent’s use of the Services. If we learn
          that personal information from users less than 18 years of age has
          been collected, we will deactivate the account and take reasonable
          measures to promptly delete such data from our records. If you become
          aware of any data we may have collected from children under age 18,
          please contact us at privacy@email.com.
        </p>

        <h2
          className="mt-6 text-2xl font-bold"
          id="9"
        >
          9. WHAT ARE YOUR PRIVACY RIGHTS?
        </h2>
        <p>
          <strong>In Short:</strong> In some regions, such as the European
          Economic Area (EEA), United Kingdom (UK), and Canada, you have rights
          that allow you greater access to and control over your personal
          information. You may review, change, or terminate your account at any
          time.
        </p>
        <p>
          In some regions (like the EEA, UK, and Canada), you have certain
          rights under applicable data protection laws. These may include the
          right (i) to request access and obtain a copy of your personal
          information, (ii) to request rectification or erasure; (iii) to
          restrict the processing of your personal information; and (iv) if
          applicable, to data portability. In certain circumstances, you may
          also have the right to object to the processing of your personal
          information. To make such a request, please use the contact details
          provided below. We will consider and act upon any request in
          accordance with applicable data protection laws.
        </p>
        <p>
          If we are relying on your consent to process your personal
          information, you have the right to withdraw your consent at any time.
          Please note however that this will not affect the lawfulness of the
          processing before its withdrawal, nor will it affect the processing of
          your personal information conducted in reliance on lawful processing
          grounds other than consent.
        </p>
        <p>
          If you are a resident in the EEA or UK and you believe we are
          unlawfully processing your personal information, you also have the
          right to complain to your local data protection supervisory authority.
          You can find their contact details here:{" "}
          <a href="https://ec.europa.eu/justice/data-protection/bodies/authorities/index_en.htm">
            https://ec.europa.eu/justice/data-protection/bodies/authorities/index_en.htm
          </a>
          .
        </p>
        <p>
          If you are a resident in Switzerland, the contact details for the data
          protection authorities are available here:{" "}
          <a href="https://www.edoeb.admin.ch/edoeb/en/home.html">
            https://www.edoeb.admin.ch/edoeb/en/home.html
          </a>
          .
        </p>

        <h4 className="mt-4 text-lg font-bold">Account Information</h4>
        <p>
          If you would at any time like to review or change the information in
          your account or terminate your account, you can:
        </p>
        <ul className="pl-5 list-disc">
          <li>Log in to your account settings and update your user account.</li>
          <li>Contact us using the contact information provided.</li>
        </ul>
        <p>
          Upon your request to terminate your account, we will deactivate or
          delete your account and information from our active databases.
          However, we may retain some information in our files to prevent fraud,
          troubleshoot problems, assist with any investigations, enforce our
          legal terms and/or comply with applicable legal requirements.
        </p>

        <p className="mt-4">
          Cookies and similar technologies: Most Web browsers are set to accept
          cookies by default. If you prefer, you can usually choose to set your
          browser to remove cookies and to reject cookies. If you choose to
          remove cookies or reject cookies, this could affect certain features
          or services of our Services. To opt-out of interest-based advertising
          by advertisers on our Services visit{" "}
          <a href="http://www.aboutads.info/choices/">
            http://www.aboutads.info/choices/
          </a>
          .
        </p>

        <p className="mt-4">
          If you have questions or comments about your privacy rights, you may
          email us at privacy@email.com.
        </p>

        <h2
          className="mt-6 text-2xl font-bold"
          id="10"
        >
          10. CONTROLS FOR DO-NOT-TRACK FEATURES
        </h2>
        <p>
          Most web browsers and some mobile operating systems and mobile
          applications include a Do-Not-Track (&quot;DNT&quot;) feature or
          setting you can activate to signal your privacy preference not to have
          data about your online browsing activities monitored and collected. At
          this stage no uniform technology standard for recognizing and
          implementing DNT signals has been finalized. As such, we do not
          currently respond to DNT browser signals or any other mechanism that
          automatically communicates your choice not to be tracked online. If a
          standard for online tracking is adopted that we must follow in the
          future, we will inform you about that practice in a revised version of
          this privacy notice.
        </p>

        <h2
          className="mt-6 text-2xl font-bold"
          id="11"
        >
          11. DO CALIFORNIA RESIDENTS HAVE SPECIFIC PRIVACY RIGHTS?
        </h2>
        <p>
          <strong>In Short:</strong> Yes, if you are a resident of California,
          you are granted specific rights regarding access to your personal
          information.
        </p>
        <p>
          California Civil Code Section 1798.83, also known as the &quot;Shine
          The Light&quot; law, permits our users who are California residents to
          request and obtain from us, once a year and free of charge,
          information about categories of personal information (if any) we
          disclosed to third parties for direct marketing purposes and the names
          and addresses of all third parties with which we shared personal
          information in the immediately preceding calendar year. If you are a
          California resident and would like to make such a request, please
          submit your request in writing to us using the contact information
          provided below.
        </p>
        <p>
          If you are under 18 years of age, reside in California, and have a
          registered account with a Service, you have the right to request
          removal of unwanted data that you publicly post on the Services. To
          request removal of such data, please contact us using the contact
          information provided below, and include the email address associated
          with your account and a statement that you reside in California. We
          will make sure the data is not publicly displayed on the Services, but
          please be aware that the data may not be completely or comprehensively
          removed from all our systems (e.g., backups, etc.).
        </p>

        <h2
          className="mt-6 text-2xl font-bold"
          id="12"
        >
          12. DO WE MAKE UPDATES TO THIS NOTICE?
        </h2>
        <p>
          <strong>In Short:</strong> Yes, we will update this notice as
          necessary to stay compliant with relevant laws.
        </p>
        <p>
          We may update this privacy notice from time to time. The updated
          version will be indicated by an updated &quot;Revised&quot; date and
          the updated version will be effective as soon as it is accessible. If
          we make material changes to this privacy notice, we may notify you
          either by prominently posting a notice of such changes or by directly
          sending you a notification. We encourage you to review this privacy
          notice frequently to be informed of how we are protecting your
          information.
        </p>

        <h2
          className="mt-6 text-2xl font-bold"
          id="13"
        >
          13. HOW CAN YOU CONTACT US ABOUT THIS NOTICE?
        </h2>
        <p>
          If you have questions or comments about this notice, you may email us
          at privacy@email.com or by post to:
        </p>
        <p className="mt-4">Company Name</p>
        <p>Street Address</p>
        <p>City, State, Zip Code</p>
        <p>Country</p>

        <h2
          className="mt-6 text-2xl font-bold"
          id="14"
        >
          14. HOW CAN YOU REVIEW, UPDATE, OR DELETE THE DATA WE COLLECT FROM
          YOU?
        </h2>
        <p>
          Based on the applicable laws of your country, you may have the right
          to request access to the personal information we collect from you,
          change that information, or delete it in some circumstances. To
          request to review, update, or delete your personal information, please
          submit a request to{" "}
          <Link
            href="mailto:admin@adamda.com"
            className="transition text-blue-dim hover:text-blue-dim/80"
          >
            admin@adamda.com
          </Link>
          . We will respond to your request within 30 days.
        </p>
      </div>
    </main>
  )
}
