import UndrawDocusaurusMountain from "@site/static/img/undraw_docusaurus_mountain.svg";
import UndrawDocusaurusReact from "@site/static/img/undraw_docusaurus_react.svg";
import UndrawDocusaurusTree from "@site/static/img/undraw_docusaurus_tree.svg";
import Heading from "@theme/Heading";

import clsx from "clsx";

import styles from "./styles.module.css";

interface FeatureItem {
	Svg: React.ComponentType<React.ComponentProps<"svg">>;
	description: JSX.Element;
	title: string;
}

const FeatureList: Array<FeatureItem> = [
	{
		Svg: UndrawDocusaurusMountain,
		description: (
			<>
				Docusaurus was designed from the ground up to be easily installed and used to get
				your website up and running quickly.
			</>
		),
		title: "Easy to Use",
	},
	{
		Svg: UndrawDocusaurusTree,
		description: (
			<>
				Docusaurus lets you focus on your docs, and we&apos;ll do the chores. Go ahead and
				move your docs into the <code>docs</code> directory.
			</>
		),
		title: "Focus on What Matters",
	},
	{
		Svg: UndrawDocusaurusReact,
		description: (
			<>
				Extend or customize your website layout by reusing React. Docusaurus can be extended
				while reusing the same header and footer.
			</>
		),
		title: "Powered by React",
	},
];

function Feature({ Svg, description, title }: Readonly<FeatureItem>): JSX.Element {
	return (
		<div className={clsx("col col--4")}>
			<div className="text--center">
				<Svg className={styles.featureSvg} role="img" />
			</div>

			<div className="text--center padding-horiz--md">
				<Heading as="h3">{title}</Heading>
				<p>{description}</p>
			</div>
		</div>
	);
}

export default function HomepageFeatures(): JSX.Element {
	return (
		<section className={styles.features}>
			<div className="container">
				<div className="row">
					{FeatureList.map((props, index) => {
						return <Feature key={index} {...props} />;
					})}
				</div>

				<div className={styles.HeaderContainer}></div>
			</div>
		</section>
	);
}
