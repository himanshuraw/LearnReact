import { Component } from 'react';
import Home from './HomeComponent'
import Menu from './MenuComponent';
import DishDetail from "./DishDetailComponent";
import Header from './HeaderComponent';
import Footer from './FooterComponent';
import Contact from './ContactComponent';
import About from './AboutComponent';
import {Routes, Route, useNavigate} from 'react-router-dom';
import { connect } from 'react-redux';
import { useParams } from 'react-router-dom';
import { postComment, fetchDishes, fetchComments, fetchPromos } from '../redux/ActionCreators';
import { actions } from 'react-redux-form';

const mapStateToProps = state => {
    return {
      dishes: state.dishes,
      comments: state.comments,
      promotions: state.promotions,
      leaders: state.leaders
    }
}

const mapDispatchToProps = (dispatch) => ({
 postComment: (dishId, rating, author, comment) => dispatch(postComment(dishId, rating, author, comment)),
 fetchDishes: () => {dispatch(fetchDishes())},
 resetFeedbackForm: () => {dispatch(actions.reset('feedback'))},
 fetchComments: () => {dispatch(fetchComments())},
 fetchPromos: () => {dispatch(fetchPromos())},

})

const withRouter = (Component) => {
  const Wrapper = (props) => {
    const history = useNavigate();
    const params = useParams();
    return (
      <Component
        history={history}
        params= {useParams}
        {...props}
        />
    );
  };
  
  return Wrapper;
};

class Main extends Component{

  constructor(props){
    super(props);
  }

  componentDidMount(){
    this.props.fetchDishes();
    this.props.fetchComments();
    this.props.fetchPromos();
  }

  render() {

    const HomePage =() => {
      return (
        <Home dish={this.props.dishes.dishes.filter((dish) => dish.featured)[0]}
        dishesLoading={this.props.dishes.isLoading}
        dishesErrMess={this.props.dishes.errMess}
        promotion={this.props.promotions.promotions.filter((promo) => promo.featured)[0]}
        promosLoading={this.props.promotions.isLoading}
        promosErrMess={this.props.promotions.errMess}
        leader={this.props.leaders.filter((leader) => leader.featured)[0]}
        />
      );
    }

    const DishWithId = () => {
      const {dishId} = useParams();
      return(
        <DishDetail dish={this.props.dishes.dishes.filter((dish)=> dish.id === Number(dishId))[0]}
          isLoading={this.props.dishes.isLoading}
          errMess={this.props.dishes.errMess}
          comments={this.props.comments.comments.filter((comment)=> comment.dishId === Number(dishId))}
          commentsErrMess={this.props.comments.errMess}
          postComment={this.props.postComment}
        />
      );
    }

    return (
      <div>
        <Header/>
        <Routes>
          <Route path="/home" element={<HomePage/>}/>
          <Route path="/menu" element={<Menu dishes={this.props.dishes}/>}/>
          <Route path="/menu/:dishId" element={<DishWithId />}/>
          <Route exact path="/contactus" element={<Contact resetFeedbackForm ={this.props.resetFeedbackForm}/>}/>
          <Route exact path="/aboutus" element={<About leaders={this.props.leaders}/>}/>
          <Route path="/" element={<HomePage/>}/>
        </Routes>
        <Footer/>
      </div>
    );
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Main));

