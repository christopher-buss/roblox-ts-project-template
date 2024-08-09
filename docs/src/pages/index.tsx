import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import HomepageFeatures from "@site/src/components/HomepageFeatures";
import Heading from "@theme/Heading";
import Layout from "@theme/Layout";

import clsx from "clsx";

import styles from "./styles.module.css";

function HomepageHeader(): React.ReactNode {
	const { siteConfig } = useDocusaurusContext();

	return (
		<div className={styles.hero} data-theme="dark">
			<div className={styles.heroInner}>
				<Heading as="h1" className={styles.heroProjectTagline}>
				<img
            alt={'D'}
            className={styles.heroLogo}
            // src={useBaseUrl('/img/docusaurus_keytar.svg')}
            width="200"
            height="200"
          />

					<span className={styles.heroTitleTextHtml} dangerouslySetInnerHTML={{
						__html: siteConfig.title,
					}}/>						
				</Heading>


				<div className={styles.indexCtas}>
          <Link className="button button--primary" to="/docs">
            Get Started
          </Link>

		  <Link className="button button--info" to="https://docusaurus.new">
           Try a Demo
          </Link>
          <span className={styles.indexCtasGitHubButtonWrapper}>
            <iframe
              className={styles.indexCtasGitHubButton}
              src="https://ghbtns.com/github-btn.html?user=christopher-buss&amp;repo=roblox-ts-project-template&amp;type=star&amp;count=true&amp;size=large"
              width={160}
              height={30}
              title="GitHub Stars"
            />
			    </span>
			</div>


      
			</div>
		</div> 
	);
}   


 
export default function Home(): React.ReactNode {
	const { siteConfig } = useDocusaurusContext();

	return (
		<Layout
			description="Description will go into a meta tag in <head />"
			title={`Hello from ${siteConfig.title}`}
		>
			<HomepageHeader />
			<main>
				<HomepageFeatures />
			</main>
		</Layout>
	);
}
