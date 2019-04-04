import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

import "../css/Main.css";

function TabContainer(props) {
	return <div style={{ padding: 8 * 3 }}>{props.children}</div>;
}

const styles = theme => ({
	root: {
		flexGrow: 1,
		width: "100%"
	},
	tabsRoot: {
		margin: "0",
		borderBottom: "1px solid #e8e8e8"
	},
	tabsIndicator: {
		backgroundColor: "#fff",
		visibility: "hidden"
	},
	tabRoot: {
		color: "#fff",
		textTransform: "initial",
		minWidth: 72,
		fontWeight: theme.typography.fontWeightRegular,
		marginRight: theme.spacing.unit * 4,
		fontFamily: [
			"-apple-system",
			"BlinkMacSystemFont",
			'"Segoe UI"',
			"Roboto",
			'"Helvetica Neue"',
			"Arial",
			"sans-serif",
			'"Apple Color Emoji"',
			'"Segoe UI Emoji"',
			'"Segoe UI Symbol"'
		].join(","),
		"&:hover": {
			color: "#eee",
			opacity: 1
		},
		"&$tabSelected": {
			color: "#fff"
		},
		"&:focus": {
			color: "#fff"
		}
	}
});

const renderTab = props => {
	console.log(props);

	return (
		<div
			style={{
				backgroundImage: `url(${props.img})`,
				backgroundSize: "cover",
				borderRadius: "4px",
				width: "160px",
				height: "65px",
				marginLeft: "5px",
				textTransform: "uppercase",
				padding: "0 15px"
			}}
			{...props}
		>
			{props.title}
		</div>
	);
};

class Main extends Component {
	state = {
		value: 0,
		categories: [],
		products: [],
		loading: false
	};

	componentDidMount() {
		this.getCategories();
	}

	getCategories() {
		this.setState({ loading: true });
		fetch(
			"https://backend.ustraa.com/rest/V1/api/homemenucategories/v1.0.1?device_type=mob"
		)
			.then(response => {
				if (response.status !== 200) {
					console.log("Something went wrong! Cannot retrieve data!");
				}

				response.json().then(data => {
					console.log(data);
					this.setState({
						categories: data.category_list,
						products: data.product_list.products,
						loading: false
					});
				});
			})
			.catch(err => {
				console.log(err);
			});
	}

	getProducts(categoryId) {
		this.setState({ loading: true });
		fetch(
			`https://backend.ustraa.com/rest/V1/api/catalog/v1.0.1?category_id=${categoryId}`
		)
			.then(response => {
				if (response.status !== 200) {
					console.log("Something went wrong! Cannot retrieve data!");
				}

				response.json().then(data => {
					console.log(data);
					this.setState({
						products: data.products,
						loading: false
					});
				});
			})
			.catch(err => {
				console.log(err);
			});
	}

	handleChange = (event, value) => {
		this.setState({ value });
		this.getProducts(this.state.categories[value].category_id);
	};

	render() {
		const { classes } = this.props;
		const { value } = this.state;

		return (
			<div className={classes.root}>
				<AppBar position="static">
					<Tabs
						value={value}
						onChange={this.handleChange}
						variant="scrollable"
						scrollButtons="off"
						className="tabs__root"
						classes={{
							root: classes.tabsRoot,
							indicator: classes.tabsIndicator
						}}
					>
						{this.state.categories.map((category, index) => (
							<Tab
								key={index}
								disableRipple
								component={renderTab}
								title={category.category_name}
								img={category.category_image}
								classes={{
									root: classes.tabRoot,
									selected: classes.tabSelected
								}}
							/>
						))}
					</Tabs>
				</AppBar>
				{this.state.loading ? (
					<div className="main__loading">Loading ...</div>
				) : (
					<TabContainer>
						{this.state.products.map((product, index) => (
							<div className="product__card" key={index}>
								<img
									src={product.image_urls.x240}
									alt={product.name}
									className="product__card-img"
								/>
								<div className="product__card-details">
									<div className="product__card-head">
										<div>{product.name}</div>
										{product.rating && (
											<div className="product__card-rating">
												{product.rating} &#9733;
											</div>
										)}
									</div>

									<div className="product__card-subhead">
										{product.weight !== 0 && (
											<div className="product__card-weight">
												({product.weight}{" "}
												{product.weight_unit})
											</div>
										)}
										<span className="product__card-final-price">
											₹ {product.final_price}
										</span>
										<span className="product__card-original-price">
											₹ {product.price}
										</span>
									</div>
									<div
										className={`product__card-btn ${
											product.is_in_stock
												? "product__card-btn--active"
												: "product__card-btn--disabled"
										}`}
									>
										{product.is_in_stock
											? "Add to cart"
											: "Out of stock"}
									</div>
								</div>
							</div>
						))}
					</TabContainer>
				)}
			</div>
		);
	}
}

Main.propTypes = {
	classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Main);
